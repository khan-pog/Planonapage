import { NextResponse } from 'next/server';
import { mockProjects } from '@/lib/mock-data';
import { createProject } from '@/lib/db';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    // Create the projects table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id serial PRIMARY KEY,
        title varchar(255) NOT NULL,
        number varchar(50) NOT NULL,
        project_manager varchar(100) NOT NULL,
        report_month varchar(7) NOT NULL,
        phase varchar(50) NOT NULL,
        status jsonb NOT NULL,
        phase_percentages jsonb NOT NULL,
        narrative jsonb NOT NULL,
        milestones jsonb NOT NULL,
        images jsonb NOT NULL,
        pm_reporting jsonb NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `;
    for (const project of mockProjects) {
      const { id, createdAt, updatedAt, ...data } = project;
      try {
        await createProject(data as any);
      } catch (err) {
        // Ignore duplicates or errors for now
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
} 