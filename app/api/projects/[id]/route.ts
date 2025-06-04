import { NextResponse } from 'next/server';
import { getProject, updateProject, deleteProject } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getProject(parseInt(params.id));
    if (!project) {
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
    const data = await request.json();
    const project = await updateProject(parseInt(params.id), data);
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }
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
    const project = await deleteProject(parseInt(params.id));
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 