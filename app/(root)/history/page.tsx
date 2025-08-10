"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getHistory, HistoryItem } from '@/services/history_service';
import HistoryCard from '@/components/HistoryCard';
import { FaChevronLeft, FaHistory, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function HistoryPage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('Not authenticated');
        }

        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        {/* <FaSpinner className="animate-spin text-4xl text-blue-400 mb-4" /> */}
        <Image
          src='/assets/Loader.gif'
          alt='loader'
          width={100}
          height={100}
        />
        <p>Loading your medical history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-400">
            Please try again later or contact support.
          </p>
        </div>
      </div>
    );
  }

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-4 sm:py-8 px-8 sm:px-50">
        <button
          onClick={() => setSelectedItem(null)}
          className="mb-6 flex items-center text-blue-400 hover:text-blue-300"
        >
          <FaChevronLeft className="mr-1" /> Back to History
        </button>

        <div className="bg-gray-800 rounded-4xl sm:p-12 p-4">
          <h1 className="text-2xl font-bold mb-4">{selectedItem.disease}</h1>
          <p className="text-gray-400 mb-6">
            {format(new Date(selectedItem.timestamp), 'MMMM d, yyyy - h:mm a')}
          </p>

          {/* Flex layout for image and predictions */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0 mb-6">
            {selectedItem.image_url && (
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3">Scan Image</h2>
                <div className="relative h-100 w-full rounded-3xl overflow-hidden bg-gray-700 border border-gray-700">
                  <Image
                    src={selectedItem.image_url}
                    alt="Medical scan"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            )}

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3">Predictions</h2>
              <div className="space-y-2">
                {selectedItem.prediction_data.top_5_diseases.map((disease, index) => (
                  <div
                    key={index}
                    className="flex flex-col space-y-1 bg-gray-700 p-3 rounded-2xl"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {disease.disease} ({Math.round(disease.probability * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-600 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${disease.probability * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details (markdown) */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Details</h2>

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-blue-400 border-b border-blue-300 pb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-semibold mt-6 mb-3 text-blue-300 border-b border-blue-200 pb-1" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-medium mt-4 mb-2 text-blue-200" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed text-gray-200" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-blue-300" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-blue-300" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-1 leading-snug" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-blue-300" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-400 hover:underline hover:text-blue-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-300 my-4" {...props} />
                ),
                hr: ({ node, ...props }) => <hr className="my-6 border-blue-300/50" {...props} />,
              }}
            >
              {selectedItem.details}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-4 sm:py-8 px-8 sm:px-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <FaHistory className="text-blue-400 text-2xl" />
          <h1 className="text-2xl font-bold">Medical History</h1>
        </div>
        <p className="text-gray-400">
          View your past diagnoses and predictions
        </p>
      </motion.div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex items-center bg-gray-800 rounded-full p-4">
            <FaHistory className='text-blue-400 text-4xl'/>
          </div>
          <h2 className="text-xl font-semibold mt-4">No History Found</h2>
          <p className="text-gray-400 mt-2 text-center max-w-md">
            You haven't made any diagnoses yet. Upload an image to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2 grid-cols-1 grid gap-4 sm:grid-cols-3 sm:gap-4">
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <HistoryCard
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
