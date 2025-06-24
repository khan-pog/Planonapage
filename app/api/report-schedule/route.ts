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
        enabled: true,
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
    const { frequency, dayOfWeek, time, enabled } = body;
    const updated = await upsertReportSchedule({
      frequency,
      dayOfWeek,
      time,
      enabled,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[report-schedule] PUT error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 