import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendCapitalManagerEmail } from "@/lib/mailer-capital";

export const revalidate = 0; // disable cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get("testEmail");

  // Collect recipient emails
  let recipientEmails: string[] = [];
  if (testEmail) {
    recipientEmails = testEmail
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
  } else {
    const recRows = await db
      .select()
      .from(schema.emailRecipients)
      .where(eq(schema.emailRecipients.isCapitalManager, true));
    recipientEmails = recRows.map((r) => r.email);
  }

  if (recipientEmails.length === 0) {
    return NextResponse.json({ skipped: true, reason: "No recipients" });
  }

  // Prepare project list (Over / Under budget)
  const projRows = await db.select().from(schema.projects);
  const interesting = projRows.filter((p: any) => {
    const ct = p.costTracking as any;
    const status = ct?.costStatus;
    return status === "Over Budget" || status === "Under Budget";
  });

  const projects = interesting.map((p: any) => {
    const ct = p.costTracking as any;
    return {
      id: p.id,
      title: p.title,
      number: p.number,
      costStatus: ct?.costStatus ?? "",
      totalBudget: ct?.totalBudget ?? null,
      currency: ct?.currency ?? null,
      variance: ct?.variance ?? null,
      link: `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/projects/${p.id}`,
    };
  });

  const monthLabel = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let sent = 0;
  let failed = 0;

  for (const email of recipientEmails) {
    const { success } = await sendCapitalManagerEmail(email, monthLabel, projects);
    success ? sent++ : failed++;
    await new Promise((res) => setTimeout(res, 600)); // throttle 600ms
  }

  return NextResponse.json({ sent, failed });
} 