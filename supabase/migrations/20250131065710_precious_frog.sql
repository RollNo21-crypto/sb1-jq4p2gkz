/*
  # Add Seller Requests Table

  1. New Tables
    - `seller_requests`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `company_name` (text)
      - `contact_name` (text)
      - `email` (text)
      - `phone` (text)
      - `business_description` (text)
      - `product_categories` (text)
      - `status` (text: pending, approved, rejected)

  2. Security
    - Enable RLS on `seller_requests` table
    - Add policies for:
      - Public insertion
      - Viewing own requests
      - Admin management
*/

-- Create seller requests table
CREATE TABLE IF NOT EXISTS seller_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  business_description text NOT NULL,
  product_categories text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE seller_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Anyone can create seller requests"
  ON seller_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow viewing own requests
CREATE POLICY "Users can view their own requests"
  ON seller_requests
  FOR SELECT
  USING (
    email = auth.jwt()->>'email'
    OR (auth.role() = 'authenticated' AND is_admin())
  );

-- Allow admin management
CREATE POLICY "Admins can manage seller requests"
  ON seller_requests
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seller_requests_email ON seller_requests(email);
CREATE INDEX IF NOT EXISTS idx_seller_requests_status ON seller_requests(status);
CREATE INDEX IF NOT EXISTS idx_seller_requests_created_at ON seller_requests(created_at);