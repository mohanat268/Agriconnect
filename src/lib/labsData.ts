export interface DefaultLab {
  id: string;
  name: string;
  location: string;
  rating: number;
  accredited: string;
  turnaround: string;
}

export const defaultLabs: DefaultLab[] = [
  {
    id: 'lab-1',
    name: 'AgriLab Precision Sciences',
    location: 'Central Agro Zone, Sector 4',
    rating: 4.9,
    accredited: 'NABL & ICAR Certified',
    turnaround: '24 Hours'
  },
  {
    id: 'lab-2',
    name: 'National Agro-Soil Testing Institute',
    location: 'North Regional Hub, Plot 12',
    rating: 4.8,
    accredited: 'Govt. Approved Lab',
    turnaround: '36 Hours'
  },
  {
    id: 'lab-3',
    name: 'BioCrop Soil Analytics & Research',
    location: 'East Valley Bio Park',
    rating: 4.9,
    accredited: 'ISO 17025 Accredited',
    turnaround: '24 Hours'
  },
  {
    id: 'lab-4',
    name: 'SoilTech Regional Diagnostic Lab',
    location: 'South Agro Industrial Area',
    rating: 4.7,
    accredited: 'NABL Certified',
    turnaround: '48 Hours'
  },
  {
    id: 'lab-5',
    name: 'Apex Soil & Micronutrient Center',
    location: 'West District Belt, Gate 2',
    rating: 4.8,
    accredited: 'ICAR Partner Lab',
    turnaround: '24 Hours'
  },
  {
    id: 'lab-6',
    name: 'EcoAgronomy Certified Labs',
    location: 'Central Green Belt, Hub 7',
    rating: 4.9,
    accredited: 'Organic Soil Specialist',
    turnaround: '36 Hours'
  },
  {
    id: 'lab-7',
    name: 'Precision Farm Soil Diagnostics',
    location: 'Tech Agro Corridor',
    rating: 4.8,
    accredited: 'AI Telemetry Partner',
    turnaround: '24 Hours'
  },
  {
    id: 'lab-8',
    name: 'TerraSoil Advanced Testing Lab',
    location: 'Valley Sector 12, Main Road',
    rating: 4.7,
    accredited: 'Heavy Metal Scan Certified',
    turnaround: '48 Hours'
  },
  {
    id: 'lab-9',
    name: 'Horizon Agro-Chemical Testing Center',
    location: 'North District Hub',
    rating: 4.8,
    accredited: 'Bio-Humus Specialist',
    turnaround: '24 Hours'
  },
  {
    id: 'lab-10',
    name: 'SoilCare Universal Diagnostic Hub',
    location: 'Metro Agri Hub, Sector 9',
    rating: 4.9,
    accredited: 'ISO 9001 Certified',
    turnaround: '24 Hours'
  }
];
