import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') ?? 'khan.thompson@my.jcu.edu.au';
  console.log('Sending test PM reminder to', email);
  // TODO integrate mailer
  return NextResponse.json({sent:true});
} 