import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject, deleteAllProjects, updateProject } from '@/lib/db';
import { kv } from '@vercel/kv';
import { matchesPlantAndDiscipline } from '@/lib/filter-utils';

const CACHE_KEY = 'all_projects';
const MONTHLY_CACHE_KEY = 'projects_monthly_version';

export async function GET(request: NextRequest) {
  try {
    console.log('--- /api/projects called ---');
    console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? process.env.POSTGRES_URL.slice(0, 30) + '...' : 'NOT SET');
    const url = new URL(request.url);
    const noCache = url.searchParams.get('nocache') === 'true';
    let projects;
    if (!noCache) {
      projects = await kv.get(CACHE_KEY);
      console.log('KV cache result:', projects);
    } else {
      console.log('Bypassing cache due to nocache param');
    }

    // Treat empty array as cache miss
    if (!Array.isArray(projects) || projects.length === 0) {
      try {
        projects = await getAllProjects();
        console.log('DB result:', projects);
        // Set cache with 5 minute TTL
        await kv.set(CACHE_KEY, projects, { ex: 60 * 5 });
      } catch (dbError) {
        console.error('DB query error:', dbError);
        projects = [];
      }
    }

    let projectsArray = projects as any[];

    // Apply plant / discipline filtering if query params provided
    const plantParam = url.searchParams.get('plant');
    const disciplinesParam = url.searchParams.get('disciplines');
    const disciplineArray = disciplinesParam
      ? disciplinesParam.split(',').map((d) => d.trim()).filter(Boolean)
      : null;

    if (plantParam || (disciplineArray && disciplineArray.length > 0)) {
      projectsArray = projectsArray.filter((project: any) =>
        matchesPlantAndDiscipline(project, plantParam, disciplineArray)
      );
    }

    if (url.searchParams.get('summary') === 'true') {
      const summaryProjects = projectsArray.map((project: any) => ({
        id: project.id,
        title: project.title,
        number: project.number,
        phase: project.phase,
        image: Array.isArray(project.images) ? project.images[0] : null,
        updatedAt: project.updatedAt,
      }));
      console.log('Returning summary projects:', summaryProjects);
      return NextResponse.json(summaryProjects, {
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    console.log('Returning full projects:', projectsArray);
    return NextResponse.json(projectsArray, {
      headers: {
        'Cache-Control': 'no-store',
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
    // strip out timestamps / pmReporting coming from the client
    const { createdAt: _c, updatedAt: _u, pmReporting: _p, ...rest } = data;

    // First create the project (pmReporting empty for now so we can get DB timestamp)
    let project = await createProject({ ...rest, pmReporting: [] });

    // Build initial PoAP Created entry using the DB-created timestamp
    const createdDate = new Date(project.createdAt).toISOString().split('T')[0];
    const initialReporting = [
      {
        type: 'PoAP Created',
        complete: true,
        date: createdDate,
        signatory: project.projectManager,
      },
    ];

    // Persist the initial pmReporting array (this also sets updated_at, but that is fine)
    project = await updateProject(project.id, { pmReporting: initialReporting });

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
