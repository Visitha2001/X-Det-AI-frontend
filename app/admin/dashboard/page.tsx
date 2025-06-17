'use client'
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getAllUsers, getUserCount } from '@/services/user_service';
import { getAllDiseases, getDiseaseCount } from '@/services/diseaseService';
import { getAllSubscribers } from '@/services/subscribe_service';
import { BarChart, PieChart } from '@/components/admin/Charts';

interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  is_admin?: boolean;
}

interface Disease {
  id: string;
}

interface Subscriber {
  username: string;
  email: string;
  subscribed_at?: string;
}

export default function AdminDashboard() {
  const { isAdmin, username } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [diseaseCount, setDiseaseCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [countData, usersData, diseaseCountData, diseasesData, subscribersData] = await Promise.all([
          getUserCount(),
          getAllUsers(),
          getDiseaseCount(),
          getAllDiseases(),
          getAllSubscribers(),
        ]);
        setUserCount(countData.count);
        setUsers(usersData);
        setDiseaseCount(diseaseCountData);
        setDiseases(diseasesData);
        setSubscribers(subscribersData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-800">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="text-gray-400 mb-10">
            You don't have administrator privileges to view this page.
          </p>
          <Link href="/home" className="text-white px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-800">
      <div className="text-white">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-800">
      <div className="text-red-500">Error: {error}</div>
    </div>
  );

  // Prepare data for charts
  const userRoleData = {
    labels: ['Admins', 'Users'],
    datasets: [{
      data: [
        users.filter(user => user.is_admin).length,
        users.filter(user => !user.is_admin).length
      ],
      backgroundColor: ['#10B981', '#3B82F6'],
    }]
  };

  const growthData = {
    labels: ['Users', 'Subscribers', 'Diseases'],
    datasets: [{
      label: 'Count',
      data: [userCount, subscribers.length, diseaseCount],
      backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
    }]
  };

  return (
    <div className="bg-gray-800 min-h-screen p-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="text-lg text-gray-400 mt-2">
              Welcome back, <span className="font-medium text-blue-400">{username}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-blue-400">{userCount}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Admins</h3>
            <p className="text-4xl font-bold text-red-400">
              {users.filter(user => user.is_admin).length}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Patients</h3>
            <p className="text-4xl font-bold text-purple-400">
              {users.filter(user => !user.is_admin).length}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Subscribers</h3>
            <p className="text-4xl font-bold text-yellow-400">{subscribers.length}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Diseases</h3>
            <p className="text-4xl font-bold text-green-400">{diseaseCount}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">User Roles Distribution</h3>
            <div className="h-64">
              <PieChart data={userRoleData} />
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">System Growth</h3>
            <div className="h-64">
              <BarChart data={growthData} />
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-10">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.full_name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_admin 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-blue-900 text-blue-300'
                        }`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Subscribers Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Subscribers ({subscribers.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {subscribers.slice(0, 5).map((subscriber, index) => (
                    <tr key={index} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{subscriber.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{subscriber.email}</td>
                    </tr>
                  ))}
                  {subscribers.length > 5 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-blue-400">
                        <Link href="/admin/subscribers">View all {subscribers.length} subscribers →</Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}