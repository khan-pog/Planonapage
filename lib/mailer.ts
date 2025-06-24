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

  const fromAddress = process.env.REPORTS_FROM_EMAIL || "Plan on a Page <no-reply@planonapage.com>"
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