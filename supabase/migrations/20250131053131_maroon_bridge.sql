/*
  # Initial Schema Setup for RFQ E-commerce

  1. Tables
    - products: Store product listings for both buy and donate
    - requests: Track buy and donation requests
    - sellers: Manage seller profiles and status

  2. Security
    - Enable RLS on all tables
    - Create policies for:
      - Product visibility and management
      - Request creation and viewing
      - Seller registration and profile access
    - Admin role function and policies
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  price decimal NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  seller_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  type text NOT NULL CHECK (type IN ('buy', 'donate'))
);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  products uuid[] NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  type text NOT NULL CHECK (type IN ('buy', 'donate')),
  notes text
);

-- Create sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'banned'))
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Products policies
  DROP POLICY IF EXISTS "Anyone can view active products" ON products;
  DROP POLICY IF EXISTS "Sellers can insert their own products" ON products;
  DROP POLICY IF EXISTS "Sellers can update their own products" ON products;
  DROP POLICY IF EXISTS "Admins have full access to products" ON products;
  
  -- Requests policies
  DROP POLICY IF EXISTS "Anyone can create requests" ON requests;
  DROP POLICY IF EXISTS "Users can view their own requests" ON requests;
  DROP POLICY IF EXISTS "Admins have full access to requests" ON requests;
  
  -- Sellers policies
  DROP POLICY IF EXISTS "Anyone can apply to be a seller" ON sellers;
  DROP POLICY IF EXISTS "Sellers can view their own profile" ON sellers;
  DROP POLICY IF EXISTS "Admins have full access to sellers" ON sellers;
END $$;

-- Create admin role function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for products
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Sellers can insert their own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Policies for requests
CREATE POLICY "Anyone can create requests"
  ON requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own requests"
  ON requests
  FOR SELECT
  TO authenticated
  USING (user_email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

-- Policies for sellers
CREATE POLICY "Anyone can apply to be a seller"
  ON sellers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can view their own profile"
  ON sellers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins have full access to products"
  ON products
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins have full access to requests"
  ON requests
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins have full access to sellers"
  ON sellers
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());