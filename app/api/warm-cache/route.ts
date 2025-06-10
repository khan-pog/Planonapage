import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/db';
import { kv } from '@vercel/kv';

const CACHE_KEY = 'all_projects';

export async function POST() {
  try {
    const projects = await getAllProjects();
    await kv.set(CACHE_KEY, projects, { ex: 60 * 5 }); // 5 min TTL
    return NextResponse.json({ message: 'Cache warmed', count: projects.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 