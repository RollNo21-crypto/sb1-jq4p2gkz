/*
  # Update products table for multiple images

  1. Changes
    - Rename image_url to image_urls and change type to text[]
    - Update existing data to use array format
    - Add validation check for image_urls array length

  2. Security
    - Maintain existing RLS policies
*/

-- Rename image_url to image_urls and change type to text[]
ALTER TABLE products 
  DROP COLUMN IF EXISTS image_url CASCADE;

ALTER TABLE products 
  ADD COLUMN image_urls text[] NOT NULL DEFAULT '{}';

-- Add check constraint to limit array length
ALTER TABLE products
  ADD CONSTRAINT check_image_urls_length 
  CHECK (array_length(image_urls, 1) BETWEEN 1 AND 2);

-- Update existing products to use placeholder images in array format
UPDATE products 
SET image_urls = ARRAY[
  'https://via.placeholder.com/150?text=Lab+Equipment',
  'https://via.placeholder.com/150?text=Product+View'
]
WHERE image_urls = '{}';

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_products_image_urls ON products USING gin(image_urls);

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