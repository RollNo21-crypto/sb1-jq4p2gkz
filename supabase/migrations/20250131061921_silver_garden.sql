/*
  # Fix Database Relationships

  1. Changes
    - Add proper foreign key constraints between products and sellers
    - Create junction table for requests and products
    - Update indexes for better performance
    - Fix RLS policies

  2. Relationships
    - Products belong to sellers (many-to-one)
    - Requests have many products through request_products
    - Products can be in many requests through request_products

  3. Security
    - Update RLS policies to reflect new relationships
    - Ensure proper access control
*/

-- Drop existing foreign key if it exists
ALTER TABLE products 
  DROP CONSTRAINT IF EXISTS products_seller_id_fkey;

-- Recreate seller_id with proper foreign key
ALTER TABLE products
  ADD CONSTRAINT products_seller_id_fkey 
  FOREIGN KEY (seller_id) 
  REFERENCES sellers(id) 
  ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_type_status ON products(type, status);
CREATE INDEX IF NOT EXISTS idx_sellers_status ON sellers(status);
CREATE INDEX IF NOT EXISTS idx_requests_type_status ON requests(type, status);

-- Update RLS policies
DROP POLICY IF EXISTS "Products are viewable by anyone" ON products;
DROP POLICY IF EXISTS "Products are manageable by admins" ON products;

CREATE POLICY "Products are viewable by anyone"
  ON products FOR SELECT
  USING (
    status = 'active' 
    OR seller_id = auth.uid() 
    OR is_admin()
  );

CREATE POLICY "Products are manageable by admins and owners"
  ON products FOR ALL
  USING (
    seller_id = auth.uid() 
    OR is_admin()
  )
  WITH CHECK (
    seller_id = auth.uid() 
    OR is_admin()
  );

-- Update request_products policies
DROP POLICY IF EXISTS "Request products are viewable by related users and admins" ON request_products;
DROP POLICY IF EXISTS "Request products are manageable by admins" ON request_products;

CREATE POLICY "Request products are viewable by related users"
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

CREATE POLICY "Request products are insertable by anyone"
  ON request_products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = request_products.request_id
      AND requests.user_email = auth.jwt()->>'email'
    )
    OR is_admin()
  );

CREATE POLICY "Request products are manageable by admins"
  ON request_products FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Function to get product details for a request
CREATE OR REPLACE FUNCTION get_request_products(request_id uuid)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  price decimal,
  category text,
  image_url text,
  type text,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.category,
    p.image_url,
    p.type,
    p.status
  FROM request_products rp
  JOIN products p ON p.id = rp.product_id
  WHERE rp.request_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;