// src/app/users/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { getAllUsers, getUserCount } from '@/services/user_service';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  is_admin?: boolean;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (!isAdmin) {
      router.push('/admin/login');
    } else {
      getAllUsers()
        .then((data) => {
          const formatted = data.map((user: any) => ({
            ...user,
            id: user._id,
          }));
          setUsers(formatted);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isAdmin, router]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [countData, usersData] = await Promise.all([
          getUserCount(),
          getAllUsers(),
        ]);
        setUserCount(countData.count);
        setUsers(usersData);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      Loading...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">User Management</h1>
      
      <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-300">Statistics</h2>
        <p className="mt-2 text-blue-400">Total Users: {userCount}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-gray-300 font-medium">Username</th>
              <th className="py-3 px-4 text-left text-gray-300 font-medium">Email</th>
              <th className="py-3 px-4 text-left text-gray-300 font-medium">Full Name</th>
              <th className="py-3 px-4 text-left text-gray-300 font-medium">Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="py-3 px-4 text-white">{user.username}</td>
                <td className="py-3 px-4 text-gray-300">{user.email}</td>
                <td className="py-3 px-4 text-gray-300">{user.full_name || '-'}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    user.is_admin 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-blue-900 text-blue-300'
                  }`}>
                    {user.is_admin ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;