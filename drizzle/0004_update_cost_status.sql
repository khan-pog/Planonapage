-- Update existing projects cost status values to new enumeration
UPDATE projects
SET status = jsonb_set(status, '{cost}', '"Over Budget"', false)
WHERE status->>'cost' = 'Over';

UPDATE projects
SET status = jsonb_set(status, '{cost}', '"On Track"', false)
WHERE status->>'cost' = 'Monitor';

-- No action needed for 'On Track' which remains the same. 