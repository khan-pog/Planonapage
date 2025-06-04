import { NextResponse } from 'next/server';
import { mockProjects } from '@/lib/mock-data';
import { createProject } from '@/lib/db';

export async function POST() {
  try {
    for (const project of mockProjects) {
      const { id, ...data } = project;
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