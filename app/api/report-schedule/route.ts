import { NextResponse } from "next/server";
import { getReportSchedule, upsertReportSchedule } from "@/lib/db";

export async function GET() {
  try {
    const schedule = await getReportSchedule();
    // If no schedule exists yet, create a default one
    if (!schedule) {
      const defaultSchedule = await upsertReportSchedule({
        frequency: "weekly",
        dayOfWeek: "monday",
        time: "08:00",
        sendDate: null,
        enabled: true,
        pmReminderDay: null,
        pmFinalReminderDays: null,
        pmStartWeeksBefore: 2,
      });
      return NextResponse.json(defaultSchedule);
    }
    return NextResponse.json(schedule);
  } catch (err) {
    console.error("[report-schedule] GET error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { frequency, dayOfWeek, time, enabled, sendDate, pmReminderDay, pmFinalReminderDays, pmStartWeeksBefore } = body;
    const updated = await upsertReportSchedule({
      frequency,
      dayOfWeek,
      time,
      sendDate,
      enabled,
      pmReminderDay,
      pmFinalReminderDays,
      pmStartWeeksBefore,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[report-schedule] PUT error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 