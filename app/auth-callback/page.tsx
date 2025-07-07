// app/auth-callback/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function AuthCallback() {
  const { data: session, status } = useSession();
  const { login } = useAuth();
  const router = useRouter();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email && session?.accessToken && !hasProcessed) {
      setHasProcessed(true);
      localStorage.setItem('access_token', session.accessToken);
      if (session.user.name) {
        sessionStorage.setItem('username', session.user.name);
      }
      login(session.user.email, session.accessToken);
      router.push('/home');
    } else if (status === 'unauthenticated' && !hasProcessed) {
      setHasProcessed(true);
      router.push('/signin');
    } else if (status === 'loading') {
      // Session is still loading, do nothing and wait for it to resolve.
    }
  }, [status, session, login, router, hasProcessed]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 sm:bg-gray-900 text-white">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto items-center">
        <Image
          src='/assets/Loader.gif'
          alt='loader'
          width={100}
          height={100}
          className="m-auto"
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-400">
          Processing Login
        </h1>
        <p className="text-gray-300 mb-6">
          Please wait while we securely set up your session.
        </p>
        {status === 'loading' && (
          <p className="text-sm text-gray-400 mt-4">Initializing session...</p>
        )}
        {hasProcessed && status !== 'authenticated' && (
             <p className="text-sm text-yellow-400 mt-4">If you are not redirected, please try signing in again.</p>
        )}
      </div>
    </div>
  );
}