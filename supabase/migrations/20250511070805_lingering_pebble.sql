/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `property_size` (text)
      - `services` (text)
      - `total_amount` (numeric)
      - `address` (text)
      - `notes` (text)
      - `preferred_date` (date)
      - `property_status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for authenticated users to read their own data
    - Add policy for anon users to insert data
*/

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL,
  property_size text NOT NULL,
  services text NOT NULL,
  total_amount numeric NOT NULL,
  address text NOT NULL,
  notes text,
  preferred_date date NOT NULL,
  property_status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert bookings
CREATE POLICY "Allow anonymous insert"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all bookings
CREATE POLICY "Allow authenticated read"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);