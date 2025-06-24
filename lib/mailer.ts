interface SendResult {
  success: boolean
  error?: unknown
}

/**
 * Sends a personalised weekly report email containing a single Call-To-Action
 * button linking to the supplied gallery URL.
 *
 * Uses the Resend transactional email API by default. Provide a `RESEND_API_KEY`
 * environment variable in your Vercel project (or `.env.local` when developing)
 * as well as an optional `REPORTS_FROM_EMAIL` (defaults to
 * `reports@example.com`).
 */
export async function sendFilteredGalleryEmail(recipientEmail: string, link: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY
  if (!apiKey) {
    console.warn("[mailer] No RESEND_API_KEY/EMAIL_API_KEY configured – skipping email send.")
    return { success: false, error: "Email API key not configured" }
  }

  const fromAddress = process.env.REPORTS_FROM_EMAIL || "Plan on a Page <reports@planonapage.com>"
  const replyToAddress = process.env.REPLY_TO_EMAIL || undefined

  // Build a friendly, dated subject
  const subjectDate = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  const subject = `Project Cost Report – ${subjectDate}`

  // Pre-header text (first in body, hidden in most clients)
  const preheader = "Your latest project status is ready – click to view the live dashboard.";

  const html = /* html */ `
    <div style="display:none;font-size:1px;color:#fff;max-height:0;opacity:0;overflow:hidden">${preheader}</div>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 16px;">Hi there,</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 24px;">Your latest project cost update is ready. Tap the button below to open the live dashboard.</p>
    <p style="text-align:center;margin:0 0 32px;">
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#ffffff;border-radius:6px;text-decoration:none;font-weight:600;font-family:Arial,Helvetica,sans-serif;">View Report</a>
    </p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#666;margin:0">Questions or feedback? Just reply to this email.</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#666;margin:24px 0 0;">Regards,<br/>The Plan on a Page Team</p>
  `

  const text = `Hi there,\n\nYour latest project cost update is ready. Open the link below to view it:\n${link}\n\nRegards,\nPlan on a Page`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipientEmail,
        subject,
        html,
        text,
        reply_to: replyToAddress,
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@planonapage.com>'
        }
      }),
    })

    if (!response.ok) {
      return { success: false, error: await response.text() }
    }

    return { success: true }
  } catch (error) {
    console.error("[mailer] Failed to send email", error)
    return { success: false, error }
  }
}

/**
 * Sends up to N personalised cost-report emails using the Resend /emails/batch endpoint.
 * The API supports 100 per call; we intentionally limit to 50 to stay well under the
 * 2-requests-per-second global throttle (one batch every 600 ms).
 */
export async function sendFilteredGalleryEmailsBatch(items: {email:string; link:string}[]): Promise<{sent:number; failed:number; error?:unknown}> {
  if(items.length === 0) return {sent:0, failed:0};

  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  if(!apiKey){
    console.warn('[mailer] No RESEND_API_KEY/EMAIL_API_KEY configured – skipping batch');
    return {sent:0, failed:items.length, error:'API key missing'};
  }

  const fromAddress = process.env.REPORTS_FROM_EMAIL || "Plan on a Page <reports@planonapage.com>";
  const replyToAddress = process.env.REPLY_TO_EMAIL || undefined;

  const subjectDate = new Date().toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
  const subject = `Project Cost Report – ${subjectDate}`;

  const sleep = (ms:number)=>new Promise(res=>setTimeout(res,ms));

  // chunk into 50-size arrays
  const chunks: typeof items[] = [];
  for(let i=0;i<items.length;i+=50){ chunks.push(items.slice(i,i+50)); }

  let sent=0, failed=0, lastError:unknown;

  for(const [idx, chunk] of chunks.entries()){
    const batchPayload = chunk.map(it=>{
      const preheader = "Your latest project status is ready – click to view the live dashboard.";
      const html = /* html */ `\n        <div style=\"display:none;font-size:1px;color:#fff;max-height:0;opacity:0;overflow:hidden\">${preheader}</div>\n        <p style=\"font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 24px;\">Hi there, your latest project cost update is ready.</p>\n        <p style=\"text-align:center;margin:0 0 32px;\">\n          <a href=\"${it.link}\" style=\"display:inline-block;padding:12px 24px;background:#2563EB;color:#ffffff;border-radius:6px;text-decoration:none;font-weight:600;font-family:Arial,Helvetica,sans-serif;\">View Report</a>\n        </p>`;
      const text = `Hi there,\n\nYour latest project cost update is ready:\n${it.link}\n\nRegards,\nPlan on a Page`;

      return {from: fromAddress, to:[it.email], subject, html, text, reply_to: replyToAddress, headers:{'List-Unsubscribe':'<mailto:unsubscribe@poap.space>'}};
    });

    try{
      const resp = await fetch('https://api.resend.com/emails/batch',{
        method:'POST',
        headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
        body: JSON.stringify(batchPayload)
      });
      if(resp.ok){ sent += batchPayload.length; } else { failed += batchPayload.length; lastError = await resp.text(); }
    }catch(err){ failed += batchPayload.length; lastError = err; }

    if(idx < chunks.length-1){ await sleep(600); }
  }

  return {sent, failed, error:lastError};
} 