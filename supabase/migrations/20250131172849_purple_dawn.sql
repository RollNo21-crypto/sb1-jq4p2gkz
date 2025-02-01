-- Rename image_url to image_urls and change type to text[]
ALTER TABLE products 
  DROP COLUMN IF EXISTS image_url CASCADE;

ALTER TABLE products 
  ADD COLUMN image_url text NOT NULL DEFAULT 'https://via.placeholder.com/150?text=Lab+Equipment';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_image_url ON products(image_url);

-- Update RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Products are viewable by anyone" ON products;
DROP POLICY IF EXISTS "Products are manageable by admins and owners" ON products;

-- Recreate policies
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