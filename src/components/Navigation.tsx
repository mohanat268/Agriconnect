'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  CalendarCheck, 
  BookOpen, 
  Sprout, 
  ChevronRight
} from 'lucide-react';

const mainNavItems = [
  { name: "Farmer's Dashboard", href: '/', icon: LayoutDashboard },
  { name: 'Soil Report & AI Insights', href: '/soil-reports', icon: FileSpreadsheet },
  { name: 'Book Soil Test', href: '/book-test', icon: CalendarCheck },
  { name: 'Knowledge Hub', href: '/knowledge', icon: BookOpen },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-agri-surface-container flex flex-col h-screen sticky top-0 z-30 shadow-sm">
      {/* Brand Header */}
      <div className="p-6 border-b border-agri-surface-container flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-green-dark to-agri-green flex items-center justify-center text-white shadow-md">
          <Sprout className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-agri-green-dark tracking-tight leading-none">
            AgriConnect
          </h1>
          <span className="text-xs text-agri-text-subtle font-medium">Smart Farming Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-agri-text-subtle">
          Main Navigation
        </div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-agri-green-soft text-agri-green-dark shadow-sm border border-agri-green/20'
                  : 'text-agri-text-muted hover:bg-agri-surface-low hover:text-agri-text-main'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-agri-green-dark' : 'text-agri-text-subtle group-hover:text-agri-green'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-agri-green" />}
            </Link>
          );
        })}
      </nav>


    </aside>
  );
}
