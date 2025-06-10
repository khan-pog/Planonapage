import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject, deleteAllProjects } from '@/lib/db';
import { kv } from '@vercel/kv';

const CACHE_KEY = 'all_projects';
const MONTHLY_CACHE_KEY = 'projects_monthly_version';

export async function GET(request: NextRequest) {
  try {
    const summary = request.nextUrl.searchParams.get('summary') === 'true';
    let projects = await kv.get(CACHE_KEY);
    if (!Array.isArray(projects)) {
      projects = await getAllProjects();
      await kv.set(CACHE_KEY, projects);
    }
    // Explicitly cast projects to any[]
    const projectsArray = projects as any[];

    // If summary mode, map to minimal fields
    if (summary) {
      const summaryProjects = projectsArray.map((project: any) => ({
        id: project.id,
        title: project.title,
        number: project.number,
        phase: project.phase,
        image: Array.isArray(project.images) ? project.images[0] : null,
        updatedAt: project.updatedAt,
      }));
      return NextResponse.json(summaryProjects, {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return NextResponse.json(projectsArray, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Remove createdAt and updatedAt if present
    const { createdAt, updatedAt, ...rest } = data;
    const project = await createProject(rest);
    
    // Invalidate both caches after creating new project
    await kv.del(CACHE_KEY);
    await kv.del(MONTHLY_CACHE_KEY);
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE() {
  try {
    const deletedProjects = await deleteAllProjects();
    
    // Invalidate both caches after deleting projects
    await kv.del(CACHE_KEY);
    await kv.del(MONTHLY_CACHE_KEY);
    
    return NextResponse.json({ message: 'All projects deleted successfully', count: deletedProjects.length });
  } catch (error) {
    console.error('Error deleting projects:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Helper function to force cache invalidation (can be called via API or scheduled task)
export async function invalidateCache() {
  await kv.del(CACHE_KEY);
  await kv.del(MONTHLY_CACHE_KEY);
}
