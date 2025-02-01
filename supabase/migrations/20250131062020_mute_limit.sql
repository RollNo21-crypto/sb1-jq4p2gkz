/*
  # Fix Admin Authentication

  1. Changes
    - Add admin role type
    - Create admin user function
    - Update RLS policies for admin access
    - Add admin-specific functions

  2. Security
    - Ensure proper admin role checks
    - Restrict sensitive operations to admin only
*/

-- Create admin role type
CREATE TYPE user_role AS ENUM ('admin', 'user', 'seller');

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1
      FROM auth.users
      WHERE 
        id = auth.uid()
        AND email = 'admin@rfqmarket.com'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  IF is_admin() THEN
    RETURN 'admin'::user_role;
  ELSE
    RETURN COALESCE(
      (
        SELECT 
          CASE 
            WHEN EXISTS (SELECT 1 FROM sellers WHERE user_id = auth.uid())
            THEN 'seller'::user_role
            ELSE 'user'::user_role
          END
      ),
      'user'::user_role
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for admin access
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all users"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage users"
  ON auth.users
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Grant necessary permissions to admin role
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;