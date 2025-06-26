-- Migrate legacy safety status values
UPDATE projects
SET status = jsonb_set(status, '{safety}', '"On Track"', false)
WHERE status->>'safety' = 'Yes';

UPDATE projects
SET status = jsonb_set(status, '{safety}', '"Off Track"', false)
WHERE status->>'safety' = 'No'; 