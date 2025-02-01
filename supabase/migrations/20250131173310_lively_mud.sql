-- Add updated_at column to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add soft delete
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Update indexes
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at);

-- Update RLS policies to handle soft delete
DROP POLICY IF EXISTS "Products are viewable by anyone" ON products;
CREATE POLICY "Products are viewable by anyone"
  ON products FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      status = 'active' 
      OR seller_id = auth.uid() 
      OR is_admin()
    )
  );