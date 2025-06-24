import { NextResponse } from 'next/server';
import { getAllRecipients, insertReportHistory } from '@/lib/db';
import { buildFilteredGalleryURL } from '@/lib/report-link';
import { sendFilteredGalleryEmail } from '@/lib/mailer';

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

  // Build the list of targets: either a single test recipient or all from DB
  let recipients: {
    email: string;
    plants?: string[] | null;
    disciplines?: string[] | null;
  }[] = [];

  if (testEmail) {
    recipients.push({ email: testEmail });
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

  for (const recipient of recipients) {
    const link = buildFilteredGalleryURL({
      plants: recipient.plants ?? undefined,
      disciplines: recipient.disciplines ?? undefined,
    });

    const { success } = await sendFilteredGalleryEmail(recipient.email, link);
    if (success) {
      sent += 1;
    } else {
      failed += 1;
    }
  }

  // Insert history record (fire-and-forget)
  insertReportHistory({
    sentAt: new Date(),
    recipients: sent,
    failures: failed,
    triggeredBy: trigger,
    testEmail: testEmail ?? null,
  }).catch((err) => console.error('[reports/send] Failed to insert history', err));

  return NextResponse.json({ sent, failed });
}