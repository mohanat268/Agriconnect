export const initialSoilReports = [
  {
    reportId: 'REP-2026-001',
    farmName: 'Green Valley Plot A4',
    location: 'District 7, North Sector',
    cropType: 'Organic Wheat & Corn',
    healthScore: 88,
    nitrogen: { value: 142, unit: 'mg/kg', status: 'Optimal' },
    phosphorus: { value: 38, unit: 'mg/kg', status: 'Deficient' },
    potassium: { value: 210, unit: 'mg/kg', status: 'Optimal' },
    pHLevel: 6.8,
    moisturePercentage: 42,
    aiInsights: [
      'Nitrogen balance is optimal for mid-season growth.',
      'Phosphorus enrichment recommended before next seed sowing cycle.',
      'Soil moisture retention is high. Reduce planned drip irrigation cycle by 15%.'
    ],
    recommendedFertilizers: [
      'Rock Phosphate Granules (25 kg/acre)',
      'Bio-Organic Compost (50 kg/acre)',
      'Micronutrient Zinc-Iron Blend'
    ],
    reportDate: new Date('2026-07-20')
  },
  {
    reportId: 'REP-2026-002',
    farmName: 'SunRidge Farm - Field B2',
    location: 'East Agro Zone',
    cropType: 'High-Yield Rice',
    healthScore: 74,
    nitrogen: { value: 95, unit: 'mg/kg', status: 'Deficient' },
    phosphorus: { value: 52, unit: 'mg/kg', status: 'Optimal' },
    potassium: { value: 185, unit: 'mg/kg', status: 'Optimal' },
    pHLevel: 7.2,
    moisturePercentage: 58,
    aiInsights: [
      'Nitrogen replenishment critical within 5 days to avoid leaf yellowing.',
      'pH level is slightly alkaline but suitable for current rice variety.',
      'Good microbial activity detected.'
    ],
    recommendedFertilizers: [
      'Neem-Coated Urea (30 kg/acre)',
      'Potash Booster (15 kg/acre)'
    ],
    reportDate: new Date('2026-07-22')
  }
];

export const initialBookings = [
  {
    bookingId: 'BK-9941',
    farmerName: 'Ramesh Patel',
    phone: '+91 98765 43210',
    email: 'ramesh.p@agrifarm.org',
    farmAddress: 'Survey No. 42, Green Belt Road, Agro Hub',
    landSizeAcres: 12.5,
    cropCategory: 'Wheat / Grains',
    packageType: 'Advanced AI Bio-Analysis',
    preferredDate: '2026-07-28',
    notes: 'Please test both upper field and lower valley soil samples.',
    status: 'Technician Assigned',
    createdAt: new Date('2026-07-23')
  }
];

export const initialKnowledgeArticles = [
  {
    articleId: 'KNOW-101',
    title: 'Optimizing Soil pH for Maximum Crop Absorption',
    category: 'Soil Health',
    summary: 'Learn how micro-adjustments in soil alkalinity can boost crop yield by up to 25% with organic soil conditioners.',
    content: 'Soil pH directly influences the availability of essential plant nutrients. When pH falls outside the 6.0 - 7.5 range, nitrogen and phosphorus binding efficiency drops dramatically. Using agricultural lime for acidic soils or elemental sulfur for alkaline soils restores microbial equilibrium.',
    readTime: '6 min read',
    author: 'Dr. Anita Sharma (Agri-Soil Specialist)',
    tags: ['pH Level', 'Soil Nutrients', 'Organic Farming'],
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
  },
  {
    articleId: 'KNOW-102',
    title: 'AI Sensor Integration in Precision Drip Irrigation',
    category: 'Irrigation',
    summary: 'How IoT moisture telemetry coupled with satellite weather feeds cuts water consumption by 40%.',
    content: 'Smart drip irrigation systems monitor volumetric water content (VWC) at 15cm and 45cm soil depths. Automated solenoid valves trigger only when crop stress thresholds are met, preventing root rot and water wastage.',
    readTime: '8 min read',
    author: 'Vikram Singh (IoT Agronomist)',
    tags: ['IoT Sensors', 'Drip Irrigation', 'Water Conservation'],
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80'
  },
  {
    articleId: 'KNOW-103',
    title: 'Early Pest Risk Detection Using AI Leaf Scanning',
    category: 'Pest Control',
    summary: 'Detect fall armyworm and rust fungus symptoms 10 days before visible field outbreak.',
    content: 'Machine vision models trained on thousands of crop disease samples allow farmers to snap a smartphone photo of leaf discoloration and receive targeted organic treatment instructions instantly.',
    readTime: '5 min read',
    author: 'AgriConnect AI Vision Lab',
    tags: ['Pest Control', 'AI Scanning', 'Crop Protection'],
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'
  }
];
