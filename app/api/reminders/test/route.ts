import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendPmReminderEmail } from "@/lib/mailer-reminder";
import { insertReportHistory } from "@/lib/db";
import { resolveReportSchedule } from "@/lib/schedule-utils";

const sleep = (ms:number)=>new Promise(res=>setTimeout(res,ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('email');
  if(!raw){ return new NextResponse('Missing ?email param', {status:400}); }
  const emails = raw.split(',').map(e=>e.trim()).filter(Boolean);
  console.log('Sending test PM reminder to', emails);

  // pick up to 3 random projects for demo
  const projects = await db.select().from(schema.projects);
  const shuffled = projects.sort(()=>0.5 - Math.random()).slice(0, Math.min(3, projects.length));
  const projectItems = shuffled.map(p=>({ id:p.id, title:p.title, link:`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/projects/${p.id}/edit`}));

  let sent=0, failed=0, lastError:unknown;
  const sched = await resolveReportSchedule();
  const dueDate = sched?.windowClose ?? undefined;

  for(const [idx, em] of emails.entries()){
    if(idx>0) await sleep(600); // throttle to <=2 req/sec
    const { success, error } = await sendPmReminderEmail(em, projectItems, dueDate);
    if(success) sent++; else { failed++; lastError = error; }
  }

  await insertReportHistory({ sentAt:new Date(), recipients: sent, failures: failed, triggeredBy:'demo', testEmail: raw });
  if(failed>0){
    return NextResponse.json({sent, failed, error:lastError}, {status:500});
  }
  return NextResponse.json({sent, failed});
} 