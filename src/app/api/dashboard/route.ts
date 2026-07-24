import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { SoilReport } from '@/models/SoilReport';
import { SoilTestBooking } from '@/models/SoilTestBooking';
import { initialSoilReports, initialBookings } from '@/lib/seedData';

export async function GET() {
  const { isConnected } = await connectToDatabase();

  let reports = initialSoilReports;
  let bookings = initialBookings;

  if (isConnected) {
    try {
      const dbReports = await SoilReport.find().sort({ reportDate: -1 }).limit(5);
      const dbBookings = await SoilTestBooking.find().sort({ createdAt: -1 }).limit(5);
      if (dbReports.length > 0) reports = JSON.parse(JSON.stringify(dbReports));
      if (dbBookings.length > 0) bookings = JSON.parse(JSON.stringify(dbBookings));
    } catch (err) {
      console.error('Error fetching dashboard data from MongoDB:', err);
    }
  }

  const latestReport = reports[0];

  return NextResponse.json({
    success: true,
    telemetry: {
      fieldId: 'Agri-Sector-04',
      farmName: latestReport ? latestReport.farmName : 'Green Valley Main Farm',
      soilMoisture: latestReport ? latestReport.moisturePercentage : 42,
      soilHealthScore: latestReport ? latestReport.healthScore : 88,
      temperature: 28.5,
      humidity: 65,
      weatherCondition: 'Partly Cloudy',
      forecastRainChance: 15,
      npkRatio: {
        n: latestReport ? latestReport.nitrogen.value : 142,
        p: latestReport ? latestReport.phosphorus.value : 38,
        k: latestReport ? latestReport.potassium.value : 210
      },
      pH: latestReport ? latestReport.pHLevel : 6.8
    },
    recentReports: reports,
    recentBookings: bookings,
    alerts: [
      {
        id: 'ALT-1',
        type: 'warning',
        title: 'Phosphorus Deficit Detected',
        message: 'Plot A4 exhibits 38 mg/kg P levels. Apply Rock Phosphate booster within 7 days.',
        timestamp: '2 hours ago'
      },
      {
        id: 'ALT-2',
        type: 'info',
        title: 'Optimal Irrigation Window',
        message: 'Soil moisture is 42%. Scheduled drip cycle at 06:00 AM tomorrow.',
        timestamp: '5 hours ago'
      }
    ]
  });
}
