import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendPmReminderEmail } from "@/lib/mailer-reminder";
import { insertReportHistory } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { startOfMonth, subMonths, subDays, subWeeks } from "date-fns";
import { inArray } from "drizzle-orm";
import { resolveReportSchedule } from "@/lib/schedule-utils";

export async function POST() {
  try {
    const sched = await resolveReportSchedule();
    if(!sched || !sched.enabled){ return NextResponse.json({skipped:true, reason:'Schedule disabled'}); }

    const now = new Date();

    // Check if we are within reminder window
    if(now < sched.windowOpen || now > sched.windowClose){
      return NextResponse.json({skipped:true, reason:'Outside reminder window'});
    }

    // Check weekly reminder day unless it is final reminder day
    const dowNames=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const todayName = dowNames[now.getUTCDay()];
    const isFinalDay = now >= sched.windowClose;
    if(!isFinalDay && sched.pmReminderDay && sched.pmReminderDay.toLowerCase()!==todayName){
      return NextResponse.json({skipped:true, reason:'Not reminder day'});
    }

    // get PM recipients
    const pmRecipients = await db.select().from(schema.emailRecipients).where(eq(schema.emailRecipients.isPm, true));

    let sent = 0, failed = 0;

    for(const rec of pmRecipients){
      const ids = rec.projectIds ?? [];
      if(ids.length===0) continue;
      // fetch projects
      const projects = await db.select().from(schema.projects).where(inArray(schema.projects.id, ids));
      // determine outstanding – project not updated since last report
      let lastSend: Date;
      if(sched.frequency === 'monthly'){
        lastSend = subMonths(sched.nextSend, 1);
      } else if(sched.frequency === 'weekly'){
        lastSend = subWeeks(sched.nextSend, 1);
      } else {
        lastSend = subDays(sched.nextSend, 1);
      }

      const pending = projects.filter(p=> new Date(p.updatedAt) < lastSend).map(p=>({id:p.id, title:p.title, link:`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/projects/${p.id}/edit`, lastUpdated: new Date(p.updatedAt)}));
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