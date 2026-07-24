import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISoilReport extends Document {
  reportId: string;
  farmName: string;
  location: string;
  cropType: string;
  healthScore: number; // 0 - 100
  nitrogen: { value: number; unit: string; status: 'Optimal' | 'Deficient' | 'Excess' };
  phosphorus: { value: number; unit: string; status: 'Optimal' | 'Deficient' | 'Excess' };
  potassium: { value: number; unit: string; status: 'Optimal' | 'Deficient' | 'Excess' };
  pHLevel: number;
  moisturePercentage: number;
  aiInsights: string[];
  recommendedFertilizers: string[];
  reportDate: Date;
}

const SoilReportSchema = new Schema<ISoilReport>({
  reportId: { type: String, required: true, unique: true },
  farmName: { type: String, required: true },
  location: { type: String, required: true },
  cropType: { type: String, required: true },
  healthScore: { type: Number, required: true },
  nitrogen: {
    value: Number,
    unit: { type: String, default: 'mg/kg' },
    status: { type: String, enum: ['Optimal', 'Deficient', 'Excess'], default: 'Optimal' }
  },
  phosphorus: {
    value: Number,
    unit: { type: String, default: 'mg/kg' },
    status: { type: String, enum: ['Optimal', 'Deficient', 'Excess'], default: 'Optimal' }
  },
  potassium: {
    value: Number,
    unit: { type: String, default: 'mg/kg' },
    status: { type: String, enum: ['Optimal', 'Deficient', 'Excess'], default: 'Optimal' }
  },
  pHLevel: { type: Number, required: true },
  moisturePercentage: { type: Number, required: true },
  aiInsights: [{ type: String }],
  recommendedFertilizers: [{ type: String }],
  reportDate: { type: Date, default: Date.now }
});

export const SoilReport: Model<ISoilReport> =
  mongoose.models.SoilReport || mongoose.model<ISoilReport>('SoilReport', SoilReportSchema);
