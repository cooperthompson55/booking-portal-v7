/*
  # Add agent information columns
  
  1. Changes
    - Add agent_name column (text, NOT NULL)
    - Add agent_email column (text, NOT NULL)
    - Add agent_phone column (text, NOT NULL)
    - Add agent_company column (text, NULL)
    - Remove agent_info jsonb column
*/

-- First add the new columns
ALTER TABLE bookings
ADD COLUMN agent_name text,
ADD COLUMN agent_email text,
ADD COLUMN agent_phone text,
ADD COLUMN agent_company text;

-- Copy data from agent_info to new columns for existing records
UPDATE bookings
SET 
  agent_name = COALESCE((agent_info->>'name')::text, ''),
  agent_email = COALESCE((agent_info->>'email')::text, ''),
  agent_phone = COALESCE((agent_info->>'phone')::text, ''),
  agent_company = (agent_info->>'company')::text;

-- Make required columns NOT NULL
ALTER TABLE bookings
ALTER COLUMN agent_name SET NOT NULL,
ALTER COLUMN agent_email SET NOT NULL,
ALTER COLUMN agent_phone SET NOT NULL;

-- Remove the old jsonb column
ALTER TABLE bookings
DROP COLUMN agent_info;