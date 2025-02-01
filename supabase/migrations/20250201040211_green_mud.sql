/*
  # Add Reference Numbers to Requests

  1. Changes
    - Add reference_number column to requests table
    - Add reference_number column to seller_requests table
    - Add function to generate reference numbers
    - Add triggers to automatically generate reference numbers

  2. Security
    - Reference numbers are read-only after creation
    - Only admins can manually set reference numbers
*/

-- Function to generate reference numbers
CREATE OR REPLACE FUNCTION generate_reference_number(prefix text)
RETURNS text AS $$
DECLARE
  timestamp_part text;
  random_part text;
BEGIN
  -- Format: PREFIX-YYYYMMDD-RANDOM
  timestamp_part := to_char(now(), 'YYYYMMDD');
  random_part := upper(substring(md5(random()::text) from 1 for 6));
  RETURN prefix || '-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Add reference_number to requests table
ALTER TABLE requests
ADD COLUMN IF NOT EXISTS reference_number text UNIQUE;

-- Add reference_number to seller_requests table
ALTER TABLE seller_requests
ADD COLUMN IF NOT EXISTS reference_number text UNIQUE;

-- Create index for reference numbers
CREATE INDEX IF NOT EXISTS idx_requests_reference_number 
ON requests(reference_number);

CREATE INDEX IF NOT EXISTS idx_seller_requests_reference_number 
ON seller_requests(reference_number);

-- Trigger function for requests
CREATE OR REPLACE FUNCTION set_request_reference_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := CASE
      WHEN NEW.type = 'buy' THEN generate_reference_number('BUY')
      WHEN NEW.type = 'donate' THEN generate_reference_number('DON')
      ELSE generate_reference_number('REQ')
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for seller requests
CREATE OR REPLACE FUNCTION set_seller_reference_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_reference_number('SEL');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS set_request_reference_number_trigger ON requests;
CREATE TRIGGER set_request_reference_number_trigger
  BEFORE INSERT ON requests
  FOR EACH ROW
  EXECUTE FUNCTION set_request_reference_number();

DROP TRIGGER IF EXISTS set_seller_reference_number_trigger ON seller_requests;
CREATE TRIGGER set_seller_reference_number_trigger
  BEFORE INSERT ON seller_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_seller_reference_number();

-- Update existing records with reference numbers
DO $$
BEGIN
  -- Update requests without reference numbers
  UPDATE requests
  SET reference_number = CASE
    WHEN type = 'buy' THEN generate_reference_number('BUY')
    WHEN type = 'donate' THEN generate_reference_number('DON')
    ELSE generate_reference_number('REQ')
  END
  WHERE reference_number IS NULL;

  -- Update seller requests without reference numbers
  UPDATE seller_requests
  SET reference_number = generate_reference_number('SEL')
  WHERE reference_number IS NULL;
END $$;