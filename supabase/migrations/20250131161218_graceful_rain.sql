/*
  # Add Storage Bucket and Policies

  1. Creates product-images bucket
  2. Adds RLS policies for:
    - Public read access
    - Admin write access
*/

-- Create product-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow admin upload access
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND (
    SELECT is_admin()
    FROM public.is_admin() AS is_admin
  )
);

-- Allow admin delete access
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND (
    SELECT is_admin()
    FROM public.is_admin() AS is_admin
  )
);