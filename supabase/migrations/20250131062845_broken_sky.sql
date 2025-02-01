/*
  # Fix request submission and RLS policies

  1. Changes
    - Update RLS policies for requests table to allow unauthenticated request creation
    - Add policies for request_products table
    - Fix foreign key relationships
  
  2. Security
    - Maintain RLS while allowing public request submission
    - Ensure proper access control for admins
*/

-- Update RLS policies for requests
DROP POLICY IF EXISTS "Anyone can create requests" ON requests;
DROP POLICY IF EXISTS "Requests are viewable by owners and admins" ON requests;
DROP POLICY IF EXISTS "Requests are manageable by admins" ON requests;

-- Allow public request creation
CREATE POLICY "Public request creation"
  ON requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow request viewing by owners and admins
CREATE POLICY "Request viewing"
  ON requests
  FOR SELECT
  TO public
  USING (
    user_email = coalesce(auth.jwt()->>'email', user_email)
    OR (auth.role() = 'authenticated' AND is_admin())
  );

-- Allow admin management
CREATE POLICY "Admin request management"
  ON requests
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Update RLS policies for request_products
DROP POLICY IF EXISTS "Request products are viewable by related users" ON request_products;
DROP POLICY IF EXISTS "Request products are insertable by anyone" ON request_products;
DROP POLICY IF EXISTS "Request products are manageable by admins" ON request_products;

-- Allow public creation of request products
CREATE POLICY "Public request products creation"
  ON request_products
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow viewing by related users and admins
CREATE POLICY "Request products viewing"
  ON request_products
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = request_products.request_id
      AND (
        requests.user_email = coalesce(auth.jwt()->>'email', requests.user_email)
        OR (auth.role() = 'authenticated' AND is_admin())
      )
    )
  );

-- Allow admin management
CREATE POLICY "Admin request products management"
  ON request_products
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Ensure proper foreign key relationships
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