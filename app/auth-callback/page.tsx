// app/auth-callback/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/context/AuthContext';

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
      router.push('/');
    } else if (status === 'unauthenticated' && !hasProcessed) {
      setHasProcessed(true);
      router.push('/signin');
    } else if (status === 'loading') {
      // Session is still loading, do nothing and wait for it to resolve.
    }
  }, [status, session, login, router, hasProcessed]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 sm:bg-gray-900 text-white">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-400">
          Processing Login
        </h1>
        <p className="text-gray-300 mb-6">
          Please wait while we securely set up your session.
        </p>
        <div className="flex justify-center items-center">
          <svg 
            className="animate-spin h-10 w-10 text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
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