import { pgTable, serial, text, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  number: varchar('number', { length: 50 }).notNull(),
  projectManager: varchar('project_manager', { length: 100 }).notNull(),
  reportMonth: varchar('report_month', { length: 7 }).notNull(),
  phase: varchar('phase', { length: 50 }).notNull(),
  status: jsonb('status').notNull(),
  phasePercentages: jsonb('phase_percentages').notNull(),
  narrative: jsonb('narrative').notNull(),
  milestones: jsonb('milestones').notNull(),
  images: jsonb('images').notNull(),
  pmReporting: jsonb('pm_reporting').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
