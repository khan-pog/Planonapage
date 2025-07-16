import { createProject } from '../lib/db';
import { mockProjects } from '../lib/mock-data';
import { normalizeProjectData } from '../lib/utils';

async function seed() {
  for (const project of mockProjects) {
    // Ensure legacy values are normalised before insertion
    const normalized = normalizeProjectData(project as any);
    // Remove the id field so the DB can auto-generate it
    const { id, ...data } = normalized;
    try {
      await createProject(data as any);
      console.log(`Seeded: ${project.title}`);
    } catch (err) {
      console.error(`Failed to seed: ${project.title}`, err);
    }
  }
  console.log('Seeding complete.');
}

seed().then(() => process.exit(0));
