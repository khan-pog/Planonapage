import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db';

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
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
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
