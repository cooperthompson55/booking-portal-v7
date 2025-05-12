/*
  # Add agent information to bookings table

  1. Changes
    - Add agent_info column to bookings table (JSONB)
      - name (required)
      - email (required)
      - phone (required)
      - company (optional)

  2. Security
    - No changes to RLS policies needed
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'agent_info'
  ) THEN
    ALTER TABLE bookings ADD COLUMN agent_info jsonb NOT NULL;
  END IF;
END $$;