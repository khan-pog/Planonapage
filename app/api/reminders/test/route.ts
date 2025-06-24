import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendPmReminderEmail } from "@/lib/mailer-reminder";
import { insertReportHistory } from "@/lib/db";
import { resolveReportSchedule } from "@/lib/schedule-utils";
import { eq, inArray } from "drizzle-orm";

const sleep = (ms:number)=>new Promise(res=>setTimeout(res,ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('email');
  let targetEmails: string[];
  if(raw){
    targetEmails = raw.split(',').map(e=>e.trim()).filter(Boolean);
  } else {
    // use real PM list
    const pmRecipients = await db.select().from(schema.emailRecipients).where(eq(schema.emailRecipients.isPm, true));
    targetEmails = pmRecipients.map(r=>r.email);
  }
  console.log('Sending test PM reminder to', targetEmails);

  const sched = await resolveReportSchedule();
  if(!sched){ return NextResponse.json({error:'No schedule configured'}, {status:500}); }
  const dueDate = sched.windowClose;

  let sent = 0, failed = 0, lastError: unknown;
  for(const [idx, email] of targetEmails.entries()){
    // find this PM's projects if in DB
    const recArr = await db.select().from(schema.emailRecipients).where(eq(schema.emailRecipients.email, email));
    const rec = recArr[0];
    const ids = rec?.projectIds ?? [];
    if(ids.length===0) continue;
    const projects = await db.select().from(schema.projects).where(inArray(schema.projects.id, ids));
    const pending = projects.filter(p=> new Date(p.updatedAt) < sched.windowOpen).map(p=>({id:p.id, title:p.title, link:`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/projects/${p.id}/edit`, lastUpdated: new Date(p.updatedAt)}));
    if(pending.length===0) continue;

    if(idx>0) await sleep(600);
    const { success, error } = await sendPmReminderEmail(email, pending, dueDate);
    if(success) sent++; else { failed++; lastError=error; }
  }

  await insertReportHistory({ sentAt:new Date(), recipients: sent, failures: failed, triggeredBy:'demo', testEmail: raw ?? null });
  if(failed>0){
    return NextResponse.json({sent, failed, error:lastError}, {status:500});
  }
  return NextResponse.json({sent, failed});
} 