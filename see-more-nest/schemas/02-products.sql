CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    image VARCHAR(255),
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
  );

INSERT INTO products (name, brand, manufacturer, price, image, category, description) VALUES
  (
    'Cyclops'' Visor',
    'X-Men',
    'Charles Xavier',
    2000,
    '/placeholder-product.png',
    'External',
    'A ruby-quartz visor designed to contain powerful optic beams that emanate from Cyclops'' eyes connected 
  to a different universe. Features adjustable longitudinal lenses with variable exit slots to control beam 
  intensity. The ruby-quartz crystal lining safely channels energy capable of rupturing steel, pulverizing 
  rock, and punching through mountains without recoil or heat generation.'
  ),
  (
    'Visor of La Forge',
    'Star Trek',
    'Star Fleet',
    4000,
    '/placeholder-product.png',
    'Internal',
    'VISOR (Visual Instrument and Sensory Organ Replacement) - Revolutionary bio-electronic sensory device 
  that detects electromagnetic signals across the entire EM spectrum from 1 Hz to 100,000 THz. Neural 
  implants in the temples transmit delta-compressed wavelengths directly to the brain, enabling vision far 
  beyond human capability including infrared, ultraviolet, heat signatures, and radio waves. Advanced 
  preprocessors use pulse compression to prevent sensory overload.'
  ),
  (
    'MJOLNIR VISR',
    'Halo',
    'UNSC',
    6000,
    '/placeholder-product.png',
    'External',
    'Visual Intelligence System, Reconnaissance (VISR) - Military-grade tactical data management system with 
  real-time battlefield intelligence. Features advanced low-light enhancement, IFF transponder detection, and
   neural interface integration. Smart-linking technology enables direct weapon-to-HUD integration, 
  displaying ammunition, heat levels, diagnostics, and semi-automatic target tracking without manual aimpoint
   adjustment. Includes comprehensive NAV mapping with enemy proximity tracking, INTEL mission objective 
  database, and COM systems. Provides enhanced vision across multiple spectrums with Friend-or-Foe 
  designation, waypoint navigation, and interactive tactical schematics for superior situational awareness.'
  ),
  (
    'Scouter',
    'Dragon Ball Z',
    'Tuffles',
    9001,
    '/placeholder-product.png',
    'External',
    'Advanced bio-scanning device capable of detecting and quantifying individual ki energy concentrations 
  through proprietary non-conventional measurement systems. Primary function calculates power levels of 
  biological entities and converts readings into numerical data for tactical assessment. Integrated 
  communications suite enables interstellar long-range transmission and real-time intelligence gathering. 
  Compact eyepiece design provides heads-up display of target data, power analysis, and remote coordination 
  capabilities across planetary distances.'
  ),
  (
    'Eye-Know Retinal Prosthesis',
    'Deus Ex',
    'Sarif Industries',
    10000,
    '/placeholder-product.png',
    'Internal',
    'Optoelectronic Retinal Heads-Up Display prosthesis with direct neural integration for seamless augmented
   reality overlay. Projects digital information directly onto user vision. Advanced suppressant technology 
  provides complete protection against blindness from harsh light sources, and visual interference devices.'
  );