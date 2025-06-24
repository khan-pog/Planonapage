import { NextResponse } from 'next/server';
import { getAllRecipients, insertReportHistory } from '@/lib/db';
import { buildFilteredGalleryURL } from '@/lib/report-link';
import { sendFilteredGalleryEmail, sendFilteredGalleryEmailsBatch } from '@/lib/mailer';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { inArray, eq } from 'drizzle-orm';
import { sendPmReminderEmail } from '@/lib/mailer-reminder';
import { subMonths, subWeeks, subDays } from 'date-fns';

/**
 * GET /api/reports/send
 *
 * Behaviour:
 *  - When `testEmail` query param is supplied, a single email will be sent to
 *    that address using a generic link (no plant / discipline filters).
 *  - Otherwise, all rows from the `email_recipients` table are fetched. Each
 *    recipient receives exactly one personalised gallery link filtered by their
 *    configured `plants` / `disciplines` preference.
 *
 * Response JSON shape: { sent: number, failed: number }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get('testEmail');

  // Resolve schedule to see if today is the real send day
  const sched = await import("@/lib/schedule-utils").then(m=>m.resolveReportSchedule());
  if(!sched){
    return NextResponse.json({error:'No schedule configured'}, {status:500});
  }
  const now = new Date();
  const send = sched.nextSend;
  const sameDay = now.getUTCFullYear()===send.getUTCFullYear() && now.getUTCMonth()===send.getUTCMonth() && now.getUTCDate()===send.getUTCDate();
  const results: any = {};
  if(!sameDay && !testEmail){
    // Not the report day – but still evaluate whether we should send a PM reminder
    const remRes = await maybeSendReminders(sched);
    return NextResponse.json({skipped:true, report:false, reminders:remRes});
  }

  // Support comma-separated list for demo/testing
  const testEmails = testEmail ? testEmail.split(',').map(e=>e.trim()).filter(Boolean) : null;

  // Build the list of targets: either a single test recipient or all from DB
  let recipients: {
    email: string;
    plants?: string[] | null;
    disciplines?: string[] | null;
  }[] = [];

  if (testEmails) {
    for (const email of testEmails) {
      recipients.push({ email });
    }
  } else {
    try {
      recipients = await getAllRecipients();
    } catch (err) {
      console.error('[reports/send] Failed to fetch recipients', err);
      return NextResponse.json(
        { error: 'Unable to fetch recipients' },
        { status: 500 },
      );
    }
  }

  let sent = 0;
  let failed = 0;

  // Determine trigger type for history
  const trigger: 'cron' | 'manual' | 'demo' = testEmail
    ? 'demo'
    : request.headers.get('x-vercel-cron') === 'true'
    ? 'cron'
    : 'manual';

  const sleep = (ms:number)=>new Promise(res=>setTimeout(res,ms));

  if(testEmails){
    // small batch, reuse single-send helper
    for(const recipient of recipients){
      const link = buildFilteredGalleryURL({ plants:recipient.plants??undefined, disciplines:recipient.disciplines??undefined });
      const { success } = await sendFilteredGalleryEmail(recipient.email, link);
      success ? sent++ : failed++;
    }
  } else {
    // production run – build payload and send in batches of 50
    const payload: {email:string; link:string}[] = recipients.map(r=>({
      email: r.email,
      link: buildFilteredGalleryURL({plants:r.plants??undefined, disciplines:r.disciplines??undefined})
    }));

    const batchRes = await sendFilteredGalleryEmailsBatch(payload);
    sent = batchRes.sent;
    failed = batchRes.failed;
  }

  // Insert history record (fire-and-forget)
  insertReportHistory({
    sentAt: new Date(),
    recipients: sent,
    failures: failed,
    triggeredBy: trigger,
    testEmail: testEmail ?? null,
  }).catch((err) => console.error('[reports/send] Failed to insert history', err));

  const reminderOutcome = await maybeSendReminders(sched);

  return NextResponse.json({ sent, failed, reminders: reminderOutcome });
}

async function maybeSendReminders(sched: Awaited<ReturnType<typeof import('@/lib/schedule-utils').resolveReportSchedule>>){
  const now = new Date();
  if(!sched) return {sent:0, failed:0, skipped:true};

  // Outside window?
  if(now < sched.windowOpen || now > sched.windowClose){
    return {sent:0, failed:0, skipped:true, reason:'Outside window'};
  }
  const dowNames=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const todayName = dowNames[now.getUTCDay()];
  const isFinalDay = now >= sched.windowClose;
  if(!isFinalDay && sched.pmReminderDay && sched.pmReminderDay.toLowerCase()!==todayName){
    return {sent:0, failed:0, skipped:true, reason:'Not reminder day'};
  }

  // gather PM recipients
  const pmRecipients = await db.select().from(schema.emailRecipients).where(eq(schema.emailRecipients.isPm, true));
  let sent=0, failed=0;

  let lastSend: Date;
  if(sched.frequency==='monthly') lastSend=subMonths(sched.nextSend,1);
  else if(sched.frequency==='weekly') lastSend=subWeeks(sched.nextSend,1);
  else lastSend=subDays(sched.nextSend,1);

  for(const rec of pmRecipients){
    const ids=rec.projectIds??[];
    if(ids.length===0) continue;
    const projects=await db.select().from(schema.projects).where(inArray(schema.projects.id, ids));
    const pending=projects.filter(p=> new Date(p.updatedAt) < lastSend).map(p=>({id:p.id,title:p.title,link:`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/projects/${p.id}/edit`,lastUpdated:new Date(p.updatedAt)}));
    if(pending.length===0) continue;
    const { success } = await sendPmReminderEmail(rec.email, pending, sched.windowClose);
    success?sent++:failed++;
    // throttle
    await new Promise(res=>setTimeout(res,600));
  }
  await insertReportHistory({sentAt:new Date(), recipients:sent, failures:failed, triggeredBy:'manual', testEmail:null});
  return {sent, failed, skipped:false};
}