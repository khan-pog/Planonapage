import { NextResponse } from "next/server";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { db } from "@/lib/db";

export async function POST() {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    return NextResponse.json({ success: true, message: "Database migrated successfully" });
  } catch (error: any) {
    console.error("Database migration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
} 