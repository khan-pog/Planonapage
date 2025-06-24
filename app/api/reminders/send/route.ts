import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendPmReminderEmail } from "@/lib/mailer-reminder";
import { insertReportHistory } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { startOfMonth } from "date-fns";
import { inArray } from "drizzle-orm";
import { resolveReportSchedule } from "@/lib/schedule-utils";

export async function POST() {
  try {
    const sched = await resolveReportSchedule();
    if(!sched){ return NextResponse.json({error:'No schedule'}, {status:500}); }

    // get PM recipients
    const pmRecipients = await db.select().from(schema.emailRecipients).where(eq(schema.emailRecipients.isPm, true));

    let sent = 0, failed = 0;

    for(const rec of pmRecipients){
      const ids = rec.projectIds ?? [];
      if(ids.length===0) continue;
      // fetch projects
      const projects = await db.select().from(schema.projects).where(inArray(schema.projects.id, ids));
      // determine outstanding
      const cutoffStart = sched.windowOpen;
      const pending = projects.filter(p=> new Date(p.updatedAt) < cutoffStart).map(p=>({id:p.id, title:p.title, link:`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/projects/${p.id}/edit`, lastUpdated: new Date(p.updatedAt)}));
      if(pending.length===0) continue;
      const { success } = await sendPmReminderEmail(rec.email, pending, sched.windowClose);
      if(success) sent++; else failed++;
    }

    await insertReportHistory({sentAt:new Date(), recipients:sent, failures:failed, triggeredBy:'manual', testEmail:null});
    return NextResponse.json({sent, failed});
  }catch(err){
    console.error('[reminders/send]', err);
    return NextResponse.json({error:String(err)}, {status:500});
  }
} 