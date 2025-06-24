import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendPmReminderEmail } from "@/lib/mailer-reminder";
import { insertReportHistory } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') ?? 'khan.thompson@my.jcu.edu.au';
  console.log('Sending test PM reminder to', email);

  // pick up to 3 random projects for demo
  const projects = await db.select().from(schema.projects);
  const shuffled = projects.sort(()=>0.5 - Math.random()).slice(0, Math.min(3, projects.length));
  const projectItems = shuffled.map(p=>({ id:p.id, title:p.title, link:`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/projects/${p.id}/edit`}));

  const { success, error } = await sendPmReminderEmail(email, projectItems);

  await insertReportHistory({ sentAt:new Date(), recipients: success?1:0, failures: success?0:1, triggeredBy:'demo', testEmail: email });
  if(!success) {
    return NextResponse.json({sent:0, failed:1, error}, {status:500});
  }
  return NextResponse.json({sent:1, failed:0});
} 