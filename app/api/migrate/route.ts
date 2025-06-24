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
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
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