import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/db';

export async function GET() {
  let dbUrl = process.env.POSTGRES_URL || 'NOT SET';
  if (dbUrl.length > 30) dbUrl = dbUrl.slice(0, 30) + '...';
  try {
    const projects = await getAllProjects();
    return NextResponse.json({
      dbUrl,
      projectCount: Array.isArray(projects) ? projects.length : 'unknown',
      sample: Array.isArray(projects) && projects.length > 0 ? projects[0] : null,
    });
  } catch (error) {
    return NextResponse.json({
      dbUrl,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 