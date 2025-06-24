import { NextResponse } from "next/server";
import { sendFilteredGalleryEmail } from "@/lib/mailer";
import { buildFilteredGalleryURL } from "@/lib/report-link";
import { insertReportHistory } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') ?? 'khan.thompson@my.jcu.edu.au';
  console.log('Sending test PM reminder to', email);
  const link = buildFilteredGalleryURL({});
  const { success, error } = await sendFilteredGalleryEmail(email, link);
  await insertReportHistory({ sentAt:new Date(), recipients: success?1:0, failures: success?0:1, triggeredBy:'demo', testEmail: email });
  if(!success) {
    return NextResponse.json({sent:0, failed:1, error}, {status:500});
  }
  return NextResponse.json({sent:1, failed:0});
} 