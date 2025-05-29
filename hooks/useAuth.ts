// hooks/useAuth.ts
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useAuthToken() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem('access_token', session.accessToken);
    }
  }, [session]);

  return session?.accessToken;
}