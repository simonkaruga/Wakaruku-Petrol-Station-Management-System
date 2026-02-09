-- Add missing security columns to users table
-- Run this script if you need to manually fix the database

ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS backup_codes TEXT;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('failed_login_attempts', 'account_locked_until', 'last_failed_login', 'password_changed_at', 'token_version', 'backup_codes')
ORDER BY column_name;
