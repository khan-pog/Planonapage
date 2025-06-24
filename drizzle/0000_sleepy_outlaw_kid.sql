CREATE TYPE "public"."discipline_enum" AS ENUM('HSE', 'Rotating', 'Static', 'EIC');--> statement-breakpoint
CREATE TYPE "public"."plant_enum" AS ENUM('Granulation', 'Mineral Acid', 'Ammonia & Laboratory', 'Camp', 'Power & Utilities');--> statement-breakpoint
CREATE TYPE "public"."report_trigger_enum" AS ENUM('cron', 'manual', 'demo');--> statement-breakpoint
CREATE TABLE "email_recipients" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"plants" "plant_enum"[],
	"disciplines" "discipline_enum"[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email_recipients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"number" varchar(50) NOT NULL,
	"project_manager" varchar(100) NOT NULL,
	"report_month" varchar(7) NOT NULL,
	"phase" varchar(50) NOT NULL,
	"status" jsonb NOT NULL,
	"phase_percentages" jsonb NOT NULL,
	"narrative" jsonb NOT NULL,
	"milestones" jsonb NOT NULL,
	"images" jsonb NOT NULL,
	"pm_reporting" jsonb NOT NULL,
	"cost_tracking" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"plant" "plant_enum" NOT NULL,
	"disciplines" "discipline_enum"[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"recipients" integer NOT NULL,
	"failures" integer NOT NULL,
	"triggered_by" "report_trigger_enum" NOT NULL,
	"test_email" text
);
--> statement-breakpoint
CREATE TABLE "report_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"frequency" varchar(10) NOT NULL,
	"day_of_week" varchar(10),
	"time" varchar(5) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
