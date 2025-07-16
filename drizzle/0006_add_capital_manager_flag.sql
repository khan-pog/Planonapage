-- Add is_capital_manager flag for capital-manager email list
ALTER TABLE email_recipients
  ADD COLUMN IF NOT EXISTS is_capital_manager BOOLEAN NOT NULL DEFAULT FALSE; 