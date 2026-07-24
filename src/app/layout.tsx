import type { Metadata } from 'next';
import './globals.css';
import AuthGuard from '@/components/AuthGuard';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'AgriConnect - Smart Farming & AI Soil Insights Portal',
  description: 'Precision agricultural management, real-time soil health analytics, AI nutrient insights, and soil lab booking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-agri-surface antialiased">
        <AuthGuard>
          <AppShell>{children}</AppShell>
        </AuthGuard>
      </body>
    </html>
  );
}
