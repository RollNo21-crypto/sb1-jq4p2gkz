/*
  # Fix Database Relationships and Permissions

  1. Changes
    - Add junction table for requests and products
    - Update RLS policies
    - Fix permissions for admin access
    - Add missing indexes

  2. Security
    - Enable RLS on all tables
    - Add proper policies for admin access
    - Fix permission issues
*/

-- Create junction table for requests and products
CREATE TABLE IF NOT EXISTS request_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES requests(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE request_products ENABLE ROW LEVEL SECURITY;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_request_products_request_id ON request_products(request_id);
CREATE INDEX IF NOT EXISTS idx_request_products_product_id ON request_products(product_id);
CREATE INDEX IF NOT EXISTS idx_requests_type ON requests(type);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Update requests table to remove products array
ALTER TABLE requests DROP COLUMN IF EXISTS products;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = auth.uid()
      AND user_metadata->>'role' = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for request_products
CREATE POLICY "Anyone can view request products"
  ON request_products
  FOR SELECT
  USING (true);

CREATE POLICY "Admins have full access to request products"
  ON request_products
  USING (is_admin())
  WITH CHECK (is_admin());

-- Update policies for requests
DROP POLICY IF EXISTS "Anyone can create requests" ON requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON requests;
DROP POLICY IF EXISTS "Admins have full access to requests" ON requests;

CREATE POLICY "Anyone can create requests"
  ON requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own requests"
  ON requests
  FOR SELECT
  USING (
    user_email = auth.jwt()->>'email'
    OR is_admin()
  );

CREATE POLICY "Admins can update requests"
  ON requests
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Update policies for products
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Sellers can insert their own products" ON products;
DROP POLICY IF EXISTS "Sellers can update their own products" ON products;
DROP POLICY IF EXISTS "Admins have full access to products" ON products;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (status = 'active' OR is_admin());

CREATE POLICY "Admins can manage products"
  ON products
  USING (is_admin())
  WITH CHECK (is_admin());

-- Update policies for sellers
DROP POLICY IF EXISTS "Anyone can apply to be a seller" ON sellers;
DROP POLICY IF EXISTS "Sellers can view their own profile" ON sellers;
DROP POLICY IF EXISTS "Admins have full access to sellers" ON sellers;

CREATE POLICY "Anyone can apply to be a seller"
  ON sellers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sellers can view their own profile"
  ON sellers
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_admin()
  );

CREATE POLICY "Admins can manage sellers"
  ON sellers
  USING (is_admin())
  WITH CHECK (is_admin());

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;