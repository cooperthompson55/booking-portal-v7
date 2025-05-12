/*
  # Update bookings table schema

  1. Changes
    - Update services column to JSONB type
    - Update address column to JSONB type
    - Add user_id column with foreign key reference
    - Add status column with default value
    - Update policies for user-specific access

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own bookings
    - Allow anonymous inserts
*/

-- Create table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'bookings') THEN
    CREATE TABLE bookings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamptz DEFAULT now(),
      property_size text NOT NULL,
      services jsonb NOT NULL,
      total_amount numeric(10,2) NOT NULL,
      address jsonb NOT NULL,
      notes text,
      preferred_date date NOT NULL,
      property_status text NOT NULL,
      status text DEFAULT 'pending',
      user_id uuid REFERENCES users(id)
    );
  END IF;
END $$;

-- Enable Row Level Security if not already enabled
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE tablename = 'bookings' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN 
  DROP POLICY IF EXISTS "Allow anonymous insert" ON bookings;
  DROP POLICY IF EXISTS "Allow authenticated read" ON bookings;
  DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
  DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
END $$;

-- Create policies
CREATE POLICY "Allow anonymous insert"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);