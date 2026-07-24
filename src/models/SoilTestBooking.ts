import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISoilTestBooking extends Document {
  bookingId: string;
  farmerName: string;
  phone: string;
  email?: string;
  farmAddress: string;
  landSizeAcres: number;
  cropCategory: string;
  packageType: 'Basic Nutrient Check' | 'Advanced AI Bio-Analysis' | 'Complete Multi-Field Audit';
  preferredDate: string;
  notes?: string;
  status: 'Pending' | 'Technician Assigned' | 'Sample Collected' | 'Completed';
  createdAt: Date;
}

const SoilTestBookingSchema = new Schema<ISoilTestBooking>({
  bookingId: { type: String, required: true, unique: true },
  farmerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  farmAddress: { type: String, required: true },
  landSizeAcres: { type: Number, required: true },
  cropCategory: { type: String, required: true },
  packageType: {
    type: String,
    enum: ['Basic Nutrient Check', 'Advanced AI Bio-Analysis', 'Complete Multi-Field Audit'],
    default: 'Advanced AI Bio-Analysis'
  },
  preferredDate: { type: String, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Technician Assigned', 'Sample Collected', 'Completed'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export const SoilTestBooking: Model<ISoilTestBooking> =
  mongoose.models.SoilTestBooking || mongoose.model<ISoilTestBooking>('SoilTestBooking', SoilTestBookingSchema);
