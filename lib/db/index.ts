import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

// When running locally, you need to use the Vercel Postgres connection string
// from your project's settings. It should be the one for local connections,
// often called `POSTGRES_URL_NON_POOLING`.
// Make sure you have a .env.local file with POSTGRES_URL set.
if (!process.env.POSTGRES_URL) {
  throw new Error(
    'POSTGRES_URL environment variable is not set. Please set it in your .env.local file.'
  );
}

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
  // Remove id from the update data if it exists
  const { id: _, ...updateData } = data;
  const result = await db
    .update(schema.projects)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(schema.projects.id, id))
    .returning();
  return result[0];
}

export async function deleteProject(id: number) {
  const result = await db.delete(schema.projects).where(sql`id = ${id}`).returning();
  return result[0];
}

export async function deleteAllProjects() {
  const result = await db.delete(schema.projects).returning();
  return result;
}

// Email Recipient CRUD Operations
export async function createRecipient(data: Omit<typeof schema.emailRecipients.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  const result = await db.insert(schema.emailRecipients).values(data).returning();
  return result[0];
}

export async function getAllRecipients() {
  return await db.select().from(schema.emailRecipients);
}

export async function updateRecipient(id: number, data: Partial<typeof schema.emailRecipients.$inferInsert>) {
  const { id: _, ...updateData } = data;
  const result = await db
    .update(schema.emailRecipients)
    .set({ ...updateData, updatedAt: new Date() })
    .where(eq(schema.emailRecipients.id, id))
    .returning();
  return result[0];
}

export async function deleteRecipient(id: number) {
  const result = await db.delete(schema.emailRecipients).where(sql`id = ${id}`).returning();
  return result[0];
}
