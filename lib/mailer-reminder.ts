import { format } from 'date-fns'

interface ProjectItem { id:number; title:string; link:string }

export async function sendPmReminderEmail(recipientEmail:string, projects:ProjectItem[]): Promise<{success:boolean; error?:unknown}> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  if(!apiKey){
    console.warn('[mailer-reminder] No API key configured');
    return {success:false, error:'Email API key not configured'};
  }
  if(projects.length===0){ return {success:true}; }

  const fromAddress = process.env.REMINDER_FROM_EMAIL || process.env.REPORTS_FROM_EMAIL || "Plan on a Page <onboarding@resend.dev>";
  const subjectDate = format(new Date(), 'MMM d, yyyy');
  const subject = `REMINDER – Update PoAP reports (${subjectDate})`;

  const listHtml = projects.map(p=>`<li><a href="${p.link}">${p.title}</a></li>`).join('');
  const listText = projects.map(p=>`• ${p.title}: ${p.link}`).join('\n');

  const html = /* html */ `
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 16px;">Hi Project Manager,</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 16px;">The following projects still need their PoAP update before the next cost report is generated:</p>
    <ul style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;margin:0 0 24px;">${listHtml}</ul>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;">Please submit your updates as soon as possible.</p>
  `;
  const text = `Hi Project Manager,\n\nThe following projects still need their PoAP update:\n${listText}\n\nPlease update them as soon as possible.`;

  try{
    const response = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json'},
      body: JSON.stringify({from: fromAddress, to:recipientEmail, subject, html, text})
    });
    if(!response.ok){
      return {success:false, error: await response.text()};
    }
    return {success:true};
  }catch(err){
    console.error('[mailer-reminder] send error', err);
    return {success:false, error:err};
  }
} 