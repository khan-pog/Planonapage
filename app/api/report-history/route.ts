import { NextResponse } from "next/server";
import { getReportHistory } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
    const offset = (page - 1) * pageSize;
    const history = await getReportHistory({ limit: pageSize, offset });
    return NextResponse.json(history);
  } catch (err) {
    console.error("[report-history] GET error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 