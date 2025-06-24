import { pgTable, serial, text, varchar, timestamp, jsonb, pgEnum, boolean, integer } from 'drizzle-orm/pg-core';

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
  pmEmail: text('pm_email'),
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
  isPm: boolean('is_pm').notNull().default(false),
  projectIds: integer('project_ids').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Enum for history trigger source
export const reportTriggerEnum = pgEnum('report_trigger_enum', ['cron', 'manual', 'demo']);

// Table for scheduling configuration (single-row)
export const reportSchedules = pgTable('report_schedules', {
  id: serial('id').primaryKey(),
  frequency: varchar('frequency', { length: 10 }).notNull(), // daily | weekly | monthly
  dayOfWeek: varchar('day_of_week', { length: 10 }), // monday, tuesday, etc.
  time: varchar('time', { length: 5 }).notNull(), // HH:MM
  sendDate: varchar('send_date', { length: 10 }), // YYYY-MM-DD
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  pmReminderDay: varchar('pm_reminder_day', { length: 10 }),
  pmFinalReminderDays: integer('pm_final_reminder_days'),
  pmStartWeeksBefore: integer('pm_start_weeks_before'),
});

// History log for report sends
export const reportHistory = pgTable('report_history', {
  id: serial('id').primaryKey(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  recipients: integer('recipients').notNull(),
  failures: integer('failures').notNull(),
  triggeredBy: reportTriggerEnum('triggered_by').notNull(),
  testEmail: text('test_email'),
});
