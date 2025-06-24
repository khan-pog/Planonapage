import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if(!email){ return new NextResponse('Missing email', {status:400}); }
  console.log('Sending test PM reminder to', email);
  // TODO integrate mailer
  return NextResponse.json({sent:true});
} 