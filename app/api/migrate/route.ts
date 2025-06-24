import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    const statements = [
      `DO $$ BEGIN CREATE TYPE plant_enum AS ENUM ('Granulation', 'Mineral Acid', 'Ammonia & Laboratory', 'Camp', 'Power & Utilities'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
      `DO $$ BEGIN CREATE TYPE discipline_enum AS ENUM ('HSE', 'Rotating', 'Static', 'EIC'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
      `ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS plant plant_enum NOT NULL DEFAULT 'Granulation';`,
      `ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS disciplines discipline_enum[] NOT NULL DEFAULT ARRAY[]::discipline_enum[];`,
      `CREATE TABLE IF NOT EXISTS email_recipients (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          plants plant_enum[],
          disciplines discipline_enum[],
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          is_pm BOOLEAN NOT NULL DEFAULT FALSE
       );`,
      `ALTER TABLE IF EXISTS email_recipients ADD COLUMN IF NOT EXISTS is_pm BOOLEAN NOT NULL DEFAULT FALSE;`,
      `ALTER TABLE IF EXISTS email_recipients ADD COLUMN IF NOT EXISTS project_id INTEGER;`,
      `DO $$ BEGIN CREATE TYPE report_trigger_enum AS ENUM ('cron', 'manual', 'demo'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
      `CREATE TABLE IF NOT EXISTS report_schedules (
          id SERIAL PRIMARY KEY,
          frequency VARCHAR(10) NOT NULL,
          day_of_week VARCHAR(10),
          time VARCHAR(5) NOT NULL,
          send_date VARCHAR(10),
          enabled BOOLEAN NOT NULL DEFAULT TRUE,
          pm_reminder_day VARCHAR(10),
          pm_final_reminder_days INTEGER,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
       );`,
      `ALTER TABLE IF EXISTS report_schedules ADD COLUMN IF NOT EXISTS send_date VARCHAR(10);`,
      `ALTER TABLE IF EXISTS report_schedules ADD COLUMN IF NOT EXISTS pm_reminder_day VARCHAR(10);`,
      `ALTER TABLE IF EXISTS report_schedules ADD COLUMN IF NOT EXISTS pm_final_reminder_days INTEGER;`,
      `CREATE TABLE IF NOT EXISTS report_history (
          id SERIAL PRIMARY KEY,
          sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
          recipients INTEGER NOT NULL,
          failures INTEGER NOT NULL,
          triggered_by report_trigger_enum NOT NULL,
          test_email TEXT
       );`
    ];

    for (const text of statements) {
      await db.execute(sql.raw(text));
    }

    return NextResponse.json({ success: true, message: "Database migrated successfully (raw)" });
  } catch (error: any) {
    console.error("Database migration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
} 