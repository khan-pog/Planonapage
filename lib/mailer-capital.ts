interface SendResult {
  success: boolean;
  error?: unknown;
}

export interface CapitalProject {
  id: number;
  title: string;
  number: string;
  costStatus: string;
  totalBudget?: number | null;
  currency?: string | null;
  variance?: number | null; // positive => over budget
  link: string;
}

export async function sendCapitalManagerEmail(
  recipientEmail: string,
  monthLabel: string, // "Apr 2025"
  projects: CapitalProject[],
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  if (!apiKey) {
    console.warn("[mailer-capital] No API key configured – skipping email send.");
    return { success: false, error: "Email API key not configured" };
  }

  const fromAddress = process.env.REPORTS_FROM_EMAIL || "Plan on a Page <reports@planonapage.com>";
  const replyToAddress = process.env.REPLY_TO_EMAIL || undefined;

  const behind = projects.filter((p) => p.costStatus === "Over Budget");
  const ahead = projects.filter((p) => p.costStatus === "Under Budget");

  const subject = `Funding Status – Projects Behind / Ahead (${monthLabel})`;
  const preheader = `${behind.length} behind, ${ahead.length} ahead`;

  // Build HTML rows
  const rowsHtml = projects
    .map((p) => {
      const ragColour = p.costStatus === "Over Budget" ? "#DC2626" : "#16A34A"; // red / green
      return /* html */ `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;">${p.title} <span style="color:#6b7280;font-size:12px;">#${p.number}</span></td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:right;">${p.currency ?? ""}${p.totalBudget ?? "-"}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center;font-weight:600;color:${ragColour};">${p.costStatus}</td>
          <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center;">${p.variance ?? "-"}</td>
        </tr>`;
    })
    .join("\n");

  const projectsTable = /* html */ `
    <table style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;margin:16px 0 24px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:left;">Project</th>
          <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:right;">Budget</th>
          <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center;">Status</th>
          <th style="padding:8px 12px;border:1px solid #e5e7eb;text-align:center;">Δ vs prev&nbsp;month</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>`;

  const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/?filter=capital&month=${encodeURIComponent(monthLabel)}`;

  const html = /* html */ `
    <div style="display:none;font-size:1px;color:#ffffff;max-height:0;opacity:0;overflow:hidden">${preheader}</div>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 16px;">Hi Capital Manager,</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;margin:0 0 16px;">Here is your monthly funding status snapshot for <strong>${monthLabel}</strong>.</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;margin:0 0 8px;"><strong>${behind.length}</strong> project(s) behind budget, <strong>${ahead.length}</strong> ahead.</p>
    ${projectsTable}
    <p style="text-align:center;margin:24px 0;">
      <a href="${dashboardUrl}" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#ffffff;border-radius:6px;text-decoration:none;font-weight:600;font-family:Arial,Helvetica,sans-serif;">Open Live Dashboard</a>
    </p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#666;">Questions? Just reply to this email.</p>
    <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#999;margin-top:32px;">Regards,<br/>Plan on a Page Team</p>
  `;

  const textLines = projects.map((p) => `• ${p.title} (#${p.number}) – ${p.costStatus}`).join("\n");
  const text = `Hi Capital Manager,\n\nMonthly funding status for ${monthLabel}:\n${behind.length} behind, ${ahead.length} ahead.\n\n${textLines}\n\n${dashboardUrl}`;

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
          "List-Unsubscribe": "<mailto:unsubscribe@planonapage.com>",
        },
      }),
    });

    if (!response.ok) {
      return { success: false, error: await response.text() };
    }
    return { success: true };
  } catch (error) {
    console.error("[mailer-capital] Failed to send email", error);
    return { success: false, error };
  }
} 