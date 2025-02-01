/*
  # Add buy products data
  
  1. Data Changes
    - Insert products available for purchase
    - Products are organized by categories:
      - Pharmaceutical
      - Packaging
      - Hygiene
      - Research & Education
      - Miscellaneous
    - Each product includes:
      - Title
      - Description
      - Category
      - Manufacturer information
      - Status set as 'active'
      - Type set as 'buy'
*/

-- Insert buy products
INSERT INTO products (
  title,
  description,
  price,
  category,
  image_url,
  status,
  type
)
SELECT
  title,
  description,
  1000 as price, -- Setting a default price, should be updated with real prices
  category,
  'https://via.placeholder.com/150?text=Lab+Equipment' as image_url,
  'active' as status,
  'buy' as type
FROM (VALUES
  -- Pharmaceutical & Research
  ('Sterile Bag-in-Box Filler', 'Sterile bag-in-box filler for aseptic packaging by RAPAK. Professional-grade equipment for pharmaceutical packaging.', 'Pharmaceutical', 'https://via.placeholder.com/150?text=Pharmaceutical'),
  ('Bruker micrOTOF Mass Spectrometer', 'Refurbished Bruker micrOTOF mass spectrometer complete with control software, connectors and instructions. High-precision analytical instrument.', 'Research', 'https://via.placeholder.com/150?text=Research'),
  
  -- Packaging Equipment
  ('Semi-automatic Cartoner', 'New semi-automatic cartoner by UET. Efficient packaging solution for various industries.', 'Packaging', 'https://via.placeholder.com/150?text=Packaging'),
  ('Thermoformer CONDAMP 3', 'FARCON thermoforming machine for industrial packaging applications.', 'Packaging', 'https://via.placeholder.com/150?text=Packaging'),
  ('NERI SL400 Holster Labeler', 'Professional labeling system by NERI, ideal for industrial applications.', 'Packaging', 'https://via.placeholder.com/150?text=Packaging'),
  
  -- Hygiene & Sterilization
  ('Steam Sanitizing System', 'New steam sanitizing system by POLTI. Professional-grade sterilization equipment.', 'Hygiene', 'https://via.placeholder.com/150?text=Hygiene'),
  
  -- Laboratory Equipment
  ('Frewitt Grinder', 'Industrial-grade Frewitt grinder for laboratory and production use.', 'Laboratory Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  ('Laminar Flow Hood', 'Professional laminar flow hood for clean room and laboratory applications.', 'Laboratory Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  ('Donaldson Respiratory Air Dryer', 'High-quality air drying system for laboratory and industrial use.', 'Laboratory Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  
  -- Quality Control
  ('Instron Force Test Set', 'Precision force testing equipment for quality control applications.', 'Quality Control', 'https://via.placeholder.com/150?text=Quality+Control'),
  ('Girardin Checkweigher', 'Professional checkweighing system for accurate weight verification.', 'Quality Control', 'https://via.placeholder.com/150?text=Quality+Control'),
  
  -- Material Handling
  ('Container Vibrator', 'Industrial container vibrator for material handling applications.', 'Material Handling', 'https://via.placeholder.com/150?text=Material+Handling'),
  ('Actilift Plus Charger', 'Professional charging system for material handling equipment.', 'Material Handling', 'https://via.placeholder.com/150?text=Material+Handling'),
  
  -- Cleaning Equipment
  ('CFM Vacuum Cleaner', 'Industrial-grade vacuum cleaning system for professional use.', 'Cleaning Equipment', 'https://via.placeholder.com/150?text=Cleaning'),
  ('Nilfisk GM626 Vacuum Cleaner', 'Professional Nilfisk vacuum cleaner with accessories.', 'Cleaning Equipment', 'https://via.placeholder.com/150?text=Cleaning')
) as t (title, description, category, image_url)
WHERE NOT EXISTS (
  SELECT 1 FROM products 
  WHERE products.title = t.title 
  AND products.type = 'buy'
);