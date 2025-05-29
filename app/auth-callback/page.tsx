// app/auth-callback/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const { data: session } = useSession();
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email && session?.accessToken) {
      // Store both the token and username
      localStorage.setItem('access_token', session.accessToken);
      login(session.user.email, session.accessToken);
      router.push('/');
    } else {
      router.push('/signin');
    }
  }, [session, login, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing your login...</h1>
        <p>Please wait while we set up your account.</p>
      </div>
    </div>
  );
}