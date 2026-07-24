import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IKnowledgeArticle extends Document {
  articleId: string;
  title: string;
  category: 'Soil Health' | 'Irrigation' | 'Pest Control' | 'Crop Care' | 'AI Farming';
  summary: string;
  content: string;
  readTime: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  createdAt: Date;
}

const KnowledgeArticleSchema = new Schema<IKnowledgeArticle>({
  articleId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Soil Health', 'Irrigation', 'Pest Control', 'Crop Care', 'AI Farming'],
    required: true
  },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  readTime: { type: String, default: '5 min read' },
  author: { type: String, default: 'AgriConnect Expert Team' },
  tags: [{ type: String }],
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const KnowledgeArticle: Model<IKnowledgeArticle> =
  mongoose.models.KnowledgeArticle || mongoose.model<IKnowledgeArticle>('KnowledgeArticle', KnowledgeArticleSchema);
