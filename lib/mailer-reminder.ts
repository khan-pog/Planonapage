import { format } from 'date-fns'

interface ProjectItem { id:number; title:string; link:string; lastUpdated: Date }

export async function sendPmReminderEmail(recipientEmail:string, projects:ProjectItem[], dueDate?:Date): Promise<{success:boolean; error?:unknown}> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  if(!apiKey){
    console.warn('[mailer-reminder] No API key configured');
    return {success:false, error:'Email API key not configured'};
  }
  if(projects.length===0){ return {success:true}; }

  const fromAddress = process.env.REMINDER_FROM_EMAIL || process.env.REPORTS_FROM_EMAIL || "Plan on a Page <reminders@poap.space>";
  const replyTo = process.env.REPLY_TO_EMAIL || undefined;

  const subjectDate = format(new Date(), 'MMM d, yyyy');
  const dueStr = dueDate ? format(dueDate, 'd MMM yyyy') : null;
  const subject = dueStr ? `Reminder: update your Plan on a Page report by ${dueStr}` : `Reminder: update your Plan on a Page report (${subjectDate})`;

  const preheader = dueStr ? `Please update before ${dueStr}.` : "A quick reminder to update your project status before the next cost report.";

  const listHtml = projects.map(p=>`<li><a href="${p.link}">${p.title}</a> <span style="color:#666;font-size:12px;">(last updated ${format(p.lastUpdated,'d MMM yyyy')})</span></li>`).join('');
  const listText = projects.map(p=>`• ${p.title} (last updated ${format(p.lastUpdated,'d MMM yyyy')}): ${p.link}`).join('\n');

  const html = /* html */ `
    <div style="display:none;font-size:1px;color:#fff;max-height:0;opacity:0;overflow:hidden">${preheader}</div>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 16px;">Hi Project Manager,</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 16px;">The following projects still need their Plan on a Page update${dueStr ? ` before <strong>${dueStr}</strong>` : ''}:</p>
    <ul style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;margin:0 0 24px;">${listHtml}</ul>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#666;">Please submit your updates as soon as possible.</p>
    <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#999;">You are receiving this email because you are listed as a Project Manager in the Plan on a Page system. If you no longer wish to receive reminders reply to this email or <a href="mailto:unsubscribe@planonapage.com?subject=Unsubscribe">click here to unsubscribe</a>.</p>
  `;

  const text = `Hi Project Manager,\n\nThe following projects still need their Plan on a Page update${dueStr ? ` before ${dueStr}` : ''}:\n${listText}\n\nPlease update them as soon as possible.\n\nYou are receiving this email because you are listed as a Project Manager in the Plan on a Page system. If you no longer wish to receive reminders reply to this email.`;

  try{
    const response = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json'},
      body: JSON.stringify({
        from: fromAddress,
        to: recipientEmail,
        subject,
        html,
        text,
        reply_to: replyTo,
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@planonapage.com>'
        }
      })
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