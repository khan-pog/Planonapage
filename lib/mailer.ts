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

  const fromAddress = process.env.REPORTS_FROM_EMAIL || "reports@example.com"

  const html = /* html */ `
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 16px;">Hello,</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 24px;">Your weekly project update is ready. Click the button below to view the latest status of the projects relevant to you.</p>
    <p style="text-align:center;margin:0 0 32px;">
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#ffffff;border-radius:6px;text-decoration:none;font-weight:600;font-family:Arial,Helvetica,sans-serif;">View Project Update</a>
    </p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#666;margin:0">If you have any questions, please reply to this email.</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#666;margin:24px 0 0;">Regards,<br/>Plan on a Page</p>
  `

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
        subject: "Weekly Project Update",
        html,
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