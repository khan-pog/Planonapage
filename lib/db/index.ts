import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

export const db = drizzle(sql, { schema });

// Helper functions for database operations
export async function getProject(id: number) {
  try {
    console.log('Executing getProject query for ID:', id);
    const result = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
    console.log('Query result:', result);
    if (!result || result.length === 0) {
      console.log('No project found with ID:', id);
      return null;
    }
    return result[0];
  } catch (error) {
    console.error('Database eerror in getProject:', error);
    throw error;
  }
}

export async function getAllProjects() {
  return await db.select().from(schema.projects);
}

export async function createProject(data: Omit<typeof schema.projects.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  const result = await db.insert(schema.projects).values(data).returning();
  return result[0];
}

export async function updateProject(id: number, data: Partial<typeof schema.projects.$inferInsert>) {
  const result = await db
    .update(schema.projects)
    .set({ ...data, updatedAt: new Date() })
    .where(sql`id = ${id}`)
    .returning();
  return result[0];
}

export async function deleteProject(id: number) {
  const result = await db.delete(schema.projects).where(sql`id = ${id}`).returning();
  return result[0];
}
