"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getAllSubscribers, sendCustomEmailToAll } from '@/services/subscribe_service';

export default function SubscribersPage() {
  const [formData, setFormData] = useState({
    subject: '',
    body: ''
  });
  const [subscribers, setSubscribers] = useState<{username: string, email: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (!isAdmin) {
      router.push('/');
    } else {
      fetchSubscribers();
    }
  }, [isAuthenticated, isAdmin, router]);

  const fetchSubscribers = async () => {
    try {
      const data = await getAllSubscribers();
      setSubscribers(data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch subscribers');
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      await sendCustomEmailToAll(formData);
      toast.success('Newsletter sent successfully!');
      setFormData({ subject: '', body: '' });
    } catch (error) {
      toast.error('Failed to send newsletter');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-8">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Subscribers Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Newsletter Form */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Send Newsletter
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-100"
                  placeholder="Newsletter subject"
                />
              </div>
              
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-100"
                  placeholder="Write your newsletter content here..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSending}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    isSending 
                      ? 'bg-blue-600 cursor-not-allowed opacity-80' 
                      : 'bg-blue-700 hover:bg-blue-600'
                  } transition-colors`}
                >
                  {isSending ? 'Sending...' : 'Send Newsletter'}
                </button>
              </div>
            </form>
          </div>

          {/* Subscribers List */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100">
                Subscribers ({subscribers.length})
              </h2>
              <button 
                onClick={fetchSubscribers}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-md text-sm"
              >
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {subscribers.length > 0 ? (
                    subscribers.map((subscriber, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-750' : 'bg-gray-800'}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          {subscriber.username}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                          {subscriber.email}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-4 text-center text-sm text-gray-400">
                        No subscribers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Newsletter Preview */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Newsletter Preview
          </h2>
          
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-750">
            {formData.subject || formData.body ? (
              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-medium text-gray-100">
                  {formData.subject || '(No subject)'}
                </h3>
                <div className="whitespace-pre-line text-gray-300">
                  {formData.body || '(No content yet)'}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">
                Your newsletter preview will appear here
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}