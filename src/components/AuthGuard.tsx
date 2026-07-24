'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const publicPaths = ['/login', '/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = publicPaths.includes(pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser && !publicPaths.includes(pathname)) {
        router.replace('/login');
      } else if (currentUser && publicPaths.includes(pathname)) {
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [pathname, router, isPublicPage]);

  // Render content instantly with 0ms latency
  return <>{children}</>;
}
