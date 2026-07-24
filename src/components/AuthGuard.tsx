'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Sprout } from 'lucide-react';

const publicPaths = ['/login', '/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = publicPaths.includes(pathname);

  useEffect(() => {
    // If not authenticated and accessing a protected page, redirect immediately
    if (!auth.currentUser && !isPublicPage) {
      router.replace('/login');
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && !publicPaths.includes(pathname)) {
        router.replace('/login');
      } else if (currentUser && publicPaths.includes(pathname)) {
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [pathname, router, isPublicPage]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  // If user is authenticated, render children immediately (0ms delay)
  if (user || auth.currentUser) {
    return <>{children}</>;
  }

  // Fallback temporary spinner only during initial auth resolution
  if (loading) {
    return (
      <div className="min-h-screen bg-agri-surface flex flex-col items-center justify-center p-6 text-agri-text-main">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-green-dark to-agri-green flex items-center justify-center text-white shadow-elevated animate-pulse mb-3">
          <Sprout className="w-7 h-7 text-emerald-300" />
        </div>
        <div className="flex items-center gap-2 font-bold text-xs text-agri-green-dark">
          <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-agri-green border-t-transparent"></div>
          <span>Loading AgriConnect...</span>
        </div>
      </div>
    );
  }

  return null;
}
