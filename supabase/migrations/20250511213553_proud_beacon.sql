/*
  # Add agent information to bookings table

  1. Changes
    - Add agent_info column to bookings table with default empty JSON object
    - Make agent_info column NOT NULL after setting default value
*/

-- First add the column as nullable
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS agent_info jsonb;

-- Set default empty JSON object for existing records
UPDATE bookings 
SET agent_info = '{}'::jsonb 
WHERE agent_info IS NULL;

-- Make the column NOT NULL
ALTER TABLE bookings 
ALTER COLUMN agent_info SET NOT NULL;

-- Set default for new records
ALTER TABLE bookings 
ALTER COLUMN agent_info SET DEFAULT '{}'::jsonb;