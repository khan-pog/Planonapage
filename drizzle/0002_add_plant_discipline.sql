-- 0002_add_plant_discipline.sql
-- Adds plant_enum & discipline_enum types, updates projects table, and creates email_recipients table

-- 1. Create ENUM types (idempotent)
DO $$
BEGIN
    CREATE TYPE plant_enum AS ENUM ('Granulation', 'Mineral Acid', 'Ammonia & Laboratory', 'Camp', 'Power & Utilities');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
BEGIN
    CREATE TYPE discipline_enum AS ENUM ('HSE', 'Rotating', 'Static', 'EIC');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END;
$$;

-- 2. Extend projects table with plant & disciplines columns
ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS plant plant_enum NOT NULL DEFAULT 'Granulation',
    ADD COLUMN IF NOT EXISTS disciplines discipline_enum[] NOT NULL DEFAULT ARRAY[]::discipline_enum[];

-- 3. Create email_recipients table
CREATE TABLE IF NOT EXISTS email_recipients (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    plants plant_enum[],
    disciplines discipline_enum[],
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
); 