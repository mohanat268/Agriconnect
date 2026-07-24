import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { SoilTestBooking } from '@/models/SoilTestBooking';
import { initialBookings } from '@/lib/seedData';

// Temporary local memory store for when MongoDB connection is not active
const localBookings = [...initialBookings];

export async function GET() {
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      const bookings = await SoilTestBooking.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, bookings, source: 'MongoDB' });
    } catch (err) {
      console.error('Error fetching bookings from MongoDB:', err);
    }
  }

  return NextResponse.json({ success: true, bookings: localBookings, source: 'In-Memory Store' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { farmerName, phone, email, farmAddress, landSizeAcres, cropCategory, packageType, preferredDate, notes } = body;

    if (!farmerName || !phone || !farmAddress || !preferredDate) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required booking fields.' },
        { status: 400 }
      );
    }

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBookingData = {
      bookingId,
      farmerName,
      phone,
      email: email || '',
      farmAddress,
      landSizeAcres: Number(landSizeAcres) || 5,
      cropCategory: cropCategory || 'General Crops',
      packageType: packageType || 'Advanced AI Bio-Analysis',
      preferredDate,
      notes: notes || '',
      status: 'Pending' as const,
      createdAt: new Date()
    };

    const { isConnected } = await connectToDatabase();

    if (isConnected) {
      const created = await SoilTestBooking.create(newBookingData);
      return NextResponse.json({
        success: true,
        message: 'Soil test appointment successfully booked in MongoDB!',
        booking: created,
        source: 'MongoDB'
      });
    }

    // In-memory fallback if DB offline
    localBookings.unshift(newBookingData);

    return NextResponse.json({
      success: true,
      message: 'Soil test appointment created successfully!',
      booking: newBookingData,
      source: 'In-Memory Store'
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
