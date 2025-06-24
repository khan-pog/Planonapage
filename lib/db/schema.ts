import { pgTable, serial, text, varchar, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Define enum types for plant and discipline classifications
export const plantEnum = pgEnum('plant_enum', [
  'Granulation',
  'Mineral Acid',
  'Ammonia & Laboratory',
  'Camp',
  'Power & Utilities',
]);

export const disciplineEnum = pgEnum('discipline_enum', [
  'HSE',
  'Rotating',
  'Static',
  'EIC',
]);

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
  costTracking: jsonb('cost_tracking').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  plant: plantEnum('plant').notNull(),
  disciplines: disciplineEnum('disciplines').array().notNull().default([]),
});

// New table for email recipients
export const emailRecipients = pgTable('email_recipients', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  plants: plantEnum('plants').array(),
  disciplines: disciplineEnum('disciplines').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
