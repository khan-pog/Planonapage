import { createProject } from '../lib/db';
import { mockProjects } from '../lib/mock-data';

async function seed() {
  for (const project of mockProjects) {
    // Remove the id field so the DB can auto-generate it
    const { id, ...data } = project;
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
