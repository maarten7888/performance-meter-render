-- Drop foreign keys first
ALTER TABLE IF EXISTS consultants DROP FOREIGN KEY IF EXISTS consultants_user_id_fkey;

-- Drop the consultants table
DROP TABLE IF EXISTS consultants; 