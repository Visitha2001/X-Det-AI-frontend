'use client';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedComponent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login to view this content</div>;
  }

  return <div>Your protected content here</div>;
}