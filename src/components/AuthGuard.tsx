'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Sprout } from 'lucide-react';

const publicPaths = ['/login', '/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(!auth.currentUser);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth state is already known, avoid showing full screen loader
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && !publicPaths.includes(pathname)) {
        router.push('/login');
      } else if (currentUser && publicPaths.includes(pathname)) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const isPublicPage = publicPaths.includes(pathname);

  if (loading && !isPublicPage) {
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

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
