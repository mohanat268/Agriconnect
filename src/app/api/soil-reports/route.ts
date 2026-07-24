import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { SoilReport } from '@/models/SoilReport';
import { initialSoilReports } from '@/lib/seedData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      if (id) {
        const report = await SoilReport.findOne({ reportId: id });
        if (report) return NextResponse.json({ success: true, report });
      }
      const reports = await SoilReport.find().sort({ reportDate: -1 });
      if (reports.length > 0) return NextResponse.json({ success: true, reports });
    } catch (err) {
      console.error('MongoDB fetch error:', err);
    }
  }

  // Fallback / Standby response
  if (id) {
    const found = initialSoilReports.find((r) => r.reportId === id);
    return NextResponse.json({ success: true, report: found || initialSoilReports[0] });
  }

  return NextResponse.json({ success: true, reports: initialSoilReports });
}
