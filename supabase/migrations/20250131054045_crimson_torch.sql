/*
  # Add donation products data
  
  1. Data Changes
    - Insert donation products with categories, descriptions, and images
    - All products are set as active and available for donation
    - Products are organized by categories like:
      - Analytical Instruments
      - Balances and Measuring Equipment
      - Centrifuges and Spinning Equipment
      - Electrochemistry and Blood Analysis
      - Fermentation and Cell Culture
      - General Laboratory Equipment
      - Laboratory Incubators
      - Liquid Handling and Processing
      - Medical and Clinical Devices
      - Microscopy and Imaging
      - Mixing and Shaking Equipment
      - Molecular Biology Equipment
      - Refrigeration and Cooling Systems
      - Specialized Systems
      - Sterilization Equipment
      - Tissue Processing and Histology
*/

-- Insert donation products
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
  0 as price, -- Donations are free
  category,
  COALESCE(
    split_part(image_url, ', ', 1),
    'https://via.placeholder.com/150?text=Lab+Equipment'
  ) as image_url,
  'active' as status,
  'donate' as type
FROM (VALUES
  -- Analytical Instruments
  ('LCMS', 'For routine mass spectrometry analysis. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Analytical Instruments', 'https://via.placeholder.com/150?text=Analytical+Instrument'),
  ('Analytical & Preparative HPLC', 'For precise quantitative and qualitative analysis. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Analytical Instruments', 'https://via.placeholder.com/150?text=Analytical+Instrument'),
  ('Gas Chromatography MS/MS', 'For standard gas chromatography analysis. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Analytical Instruments', 'https://via.placeholder.com/150?text=Analytical+Instrument'),
  
  -- Balances and Measuring Equipment
  ('Analytical Balance', 'High precision for lab measurements. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Balances and Measuring Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  ('Precision Balance', 'Accurate measurements with high repeatability. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Balances and Measuring Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  ('pH Meter', 'High precision for laboratory use. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Balances and Measuring Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  
  -- Centrifuges
  ('Mini Centrifuge', 'Compact for quick, low-volume spins. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Centrifuges and Spinning Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  ('Super Speed Centrifuge', 'For large-volume sample processing. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Centrifuges and Spinning Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  
  -- Cell Culture
  ('Fermenter (15L)', 'Mid-sized for pilot-scale fermentation. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Fermentation and Cell Culture', 'https://via.placeholder.com/150?text=Cell+Culture'),
  ('Lyophilizer Jar', 'For freeze-drying biological samples. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Fermentation and Cell Culture', 'https://via.placeholder.com/150?text=Cell+Culture'),
  
  -- Lab Equipment
  ('Digital Water Bath', 'Temperature-controlled water bath for laboratory use. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'General Laboratory Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  ('Forced Convection Ovens', 'Precise temperature control and uniform heat distribution. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'General Laboratory Equipment', 'https://via.placeholder.com/150?text=Lab+Equipment'),
  
  -- Microscopy
  ('Leica DM2500 Upright Microscope', 'For high-resolution routine imaging. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Microscopy and Imaging', 'https://via.placeholder.com/150?text=Microscopy'),
  ('Compound Microscope', 'Basic optical imaging for labs. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Microscopy and Imaging', 'https://via.placeholder.com/150?text=Microscopy'),
  
  -- Molecular Biology
  ('RT-PCR System', 'Basic systems for quantitative gene expression studies. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Molecular Biology Equipment', 'https://via.placeholder.com/150?text=Molecular+Biology'),
  ('Nanodrop Spectrophotometer', 'Measure nucleic acids and protein concentration. This product is designed for optimal performance in laboratory and industrial applications, ensuring high accuracy and reliability in results.', 'Molecular Biology Equipment', 'https://via.placeholder.com/150?text=Molecular+Biology')
) as t (title, description, category, image_url)
WHERE NOT EXISTS (
  SELECT 1 FROM products 
  WHERE products.title = t.title 
  AND products.type = 'donate'
);