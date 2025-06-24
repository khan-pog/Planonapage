import { NextResponse } from 'next/server';
import { getProject, updateProject, deleteProject } from '@/lib/db';
import { kv } from '@vercel/kv';

const CACHE_KEY = 'all_projects';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      console.error('Invalid project ID:', params.id);
      return new NextResponse('Invalid project ID', { status: 400 });
    }

    console.log('Fetching project with ID:', id);
    const project = await getProject(id);
    console.log('Project result:', project);
    
    if (!project) {
      console.error('Project not found with ID:', id);
      return new NextResponse('Project not found', { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse('Invalid project ID', { status: 400 });
    }

    // Fetch the current project to access existing pmReporting array
    const current = await getProject(id);
    if (!current) {
      return new NextResponse('Project not found', { status: 404 });
    }

    const data = await request.json();
    // Exclude timestamps / pmReporting provided by client
    const { updatedAt: _u, createdAt: _c, pmReporting: _p, ...updateData } = data;

    // Prepare new PoAP Report entry using upcoming updated timestamp
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const signatory = (updateData as any).projectManager ?? current.projectManager;
    const newEntry = {
      type: 'PoAP Report',
      complete: true,
      date: dateStr,
      signatory,
    };

    const updatedReporting = [...current.pmReporting, newEntry];

    const project = await updateProject(id, { ...updateData, pmReporting: updatedReporting });
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }
    // Invalidate cache after update
    await kv.del(CACHE_KEY);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse('Invalid project ID', { status: 400 });
    }

    const project = await deleteProject(id);
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }
    // Invalidate cache after delete
    await kv.del(CACHE_KEY);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
