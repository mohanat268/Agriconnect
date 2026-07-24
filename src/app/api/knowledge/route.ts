import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { KnowledgeArticle } from '@/models/KnowledgeArticle';
import { initialKnowledgeArticles } from '@/lib/seedData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('query')?.toLowerCase();

  const { isConnected } = await connectToDatabase();

  let articles = initialKnowledgeArticles;

  if (isConnected) {
    try {
      const filter: Record<string, unknown> = {};
      if (category && category !== 'All') {
        filter.category = category;
      }
      const dbArticles = await KnowledgeArticle.find(filter).sort({ createdAt: -1 });
      if (dbArticles.length > 0) {
        articles = JSON.parse(JSON.stringify(dbArticles));
      }
    } catch (err) {
      console.error('Error querying KnowledgeArticles from MongoDB:', err);
    }
  }

  // Apply in-memory filtering for category & search term if needed
  let filtered = articles;

  if (category && category !== 'All') {
    filtered = filtered.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({ success: true, count: filtered.length, articles: filtered });
}
