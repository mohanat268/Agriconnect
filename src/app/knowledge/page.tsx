'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Clock, 
  User, 
  ChevronRight, 
  Sparkles, 
  X,
  Filter
} from 'lucide-react';

interface Article {
  articleId: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  author: string;
  tags: string[];
  imageUrl?: string;
}

const categories = ['All', 'Soil Health', 'Irrigation', 'Pest Control', 'Crop Care', 'AI Farming'];

export default function KnowledgeHubPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/knowledge', window.location.origin);
      if (selectedCategory !== 'All') url.searchParams.set('category', selectedCategory);
      if (searchQuery) url.searchParams.set('query', searchQuery);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error('Error fetching knowledge articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-agri-brown-dark via-agri-brown to-amber-900 p-8 text-white shadow-elevated">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-amber-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>AgriConnect Knowledge Library</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Agronomy & Smart Farming Knowledge Hub
          </h1>
          <p className="text-amber-100/90 text-sm leading-relaxed">
            Curated field guides, crop health protocols, soil science research, and AI precision farming techniques verified by top agricultural scientists.
          </p>

          {/* Search Bar inside Hero */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-agri-text-subtle" />
              <input
                type="text"
                placeholder="Search articles e.g. 'pH', 'drip irrigation', 'pest'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white text-agri-text-main rounded-xl border border-white/20 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-agri-text-subtle"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-agri-green text-white shadow-sm'
                  : 'bg-white border border-agri-surface-container text-agri-text-muted hover:bg-agri-surface-low'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-agri-green border-t-transparent"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-agri-surface-container space-y-2">
          <p className="font-bold text-sm text-agri-text-main">No articles found matching your filter.</p>
          <p className="text-xs text-agri-text-subtle">Try clearing the search query or selecting &quot;All&quot; categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.articleId}
              onClick={() => setActiveArticle(article)}
              className="group bg-white rounded-2xl border border-agri-surface-container shadow-card hover:shadow-soft transition-all cursor-pointer flex flex-col overflow-hidden"
            >
              {article.imageUrl && (
                <div className="h-44 w-full bg-agri-surface-low overflow-hidden relative">
                  {/* eslint-disable-next-html-element-suppression */}
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-agri-text-subtle">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-agri-green" />
                      {article.readTime}
                    </span>
                    <span>{article.author.split(' ')[0]}</span>
                  </div>
                  <h3 className="font-bold text-base text-agri-text-main group-hover:text-agri-green transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-agri-text-muted line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-agri-surface-container flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] bg-agri-surface-low text-agri-text-subtle px-2 py-0.5 rounded-md font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-agri-green flex items-center gap-0.5">
                    Read <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-agri-text-subtle hover:bg-agri-surface-low hover:text-agri-text-main transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <span className="px-3 py-1 bg-agri-green-soft text-agri-green-dark text-xs font-bold rounded-lg">
                {activeArticle.category}
              </span>
              <h2 className="text-2xl font-bold text-agri-text-main leading-tight">
                {activeArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-agri-text-subtle">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-agri-green" />
                  {activeArticle.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-agri-green" />
                  {activeArticle.readTime}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-agri-surface-low text-xs text-agri-text-muted italic border-l-4 border-agri-green">
              {activeArticle.summary}
            </div>

            <div className="prose text-xs text-agri-text-main leading-relaxed space-y-3">
              <p>{activeArticle.content}</p>
            </div>

            <div className="pt-4 border-t border-agri-surface-container flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 bg-agri-green text-white font-bold text-xs rounded-xl hover:bg-agri-green-dark transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
