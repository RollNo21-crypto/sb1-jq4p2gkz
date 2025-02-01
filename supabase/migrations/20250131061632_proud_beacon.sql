/*
  # Fix Database Relationships

  1. Changes
    - Add foreign key relationship between products and sellers
    - Add missing indexes for performance
    - Update RLS policies for better security
    - Fix request-product relationships

  2. Security
    - Update RLS policies to properly handle admin access
    - Ensure proper cascading deletes
*/

-- Add seller_id to products table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE products ADD COLUMN seller_id uuid REFERENCES sellers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for foreign keys and commonly queried fields
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_products_type_status ON products(type, status);
CREATE INDEX IF NOT EXISTS idx_requests_type_status ON requests(type, status);

-- Update request_products to ensure proper relationships
ALTER TABLE request_products
  DROP CONSTRAINT IF EXISTS request_products_request_id_fkey,
  DROP CONSTRAINT IF EXISTS request_products_product_id_fkey,
  ADD CONSTRAINT request_products_request_id_fkey 
    FOREIGN KEY (request_id) 
    REFERENCES requests(id) 
    ON DELETE CASCADE,
  ADD CONSTRAINT request_products_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES products(id) 
    ON DELETE CASCADE;

-- Update RLS policies
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = auth.uid()
      AND (
        email = 'admin@rfqmarket.com' OR
        user_metadata->>'role' = 'admin'
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Products policies
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;

CREATE POLICY "Products are viewable by anyone"
  ON products FOR SELECT
  USING (status = 'active' OR is_admin());

CREATE POLICY "Products are manageable by admins"
  ON products FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Request policies
DROP POLICY IF EXISTS "Users can view their own requests" ON requests;
DROP POLICY IF EXISTS "Admins can update requests" ON requests;

CREATE POLICY "Requests are viewable by owners and admins"
  ON requests FOR SELECT
  USING (
    user_email = auth.jwt()->>'email'
    OR is_admin()
  );

CREATE POLICY "Requests are manageable by admins"
  ON requests FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Request products policies
DROP POLICY IF EXISTS "Anyone can view request products" ON request_products;
DROP POLICY IF EXISTS "Admins have full access to request products" ON request_products;

CREATE POLICY "Request products are viewable by related users and admins"
  ON request_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = request_products.request_id
      AND (
        requests.user_email = auth.jwt()->>'email'
        OR is_admin()
      )
    )
  );

CREATE POLICY "Request products are manageable by admins"
  ON request_products FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Seller policies
DROP POLICY IF EXISTS "Sellers can view their own profile" ON sellers;
DROP POLICY IF EXISTS "Admins can manage sellers" ON sellers;

CREATE POLICY "Sellers are viewable by owners and admins"
  ON sellers FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_admin()
  );

CREATE POLICY "Sellers are manageable by admins"
  ON sellers FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;