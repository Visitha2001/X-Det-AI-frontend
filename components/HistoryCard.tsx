"use client";

import { HistoryItem } from '@/services/history_service';
import { format } from 'date-fns';
import Image from 'next/image';
import { FaChevronRight, FaNotesMedical } from 'react-icons/fa';
import { RiVirusLine } from 'react-icons/ri';

interface HistoryCardProps {
  item: HistoryItem;
  onClick: () => void;
}

export default function HistoryCard({ item, onClick }: HistoryCardProps) {
  return (
    <div 
      className="bg-gray-800/80 sm:h-110 h-115 rounded-4xl p-4 mb-4 border border-gray-950 hover:border-blue-600 transition-colors cursor-pointer"
      // className="bg-gray-800 sm:h-115 h-115 rounded-4xl p-4 mb-4 border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-700 p-3 rounded-full">
            {item.disease === 'No Finding' ? (
              <FaNotesMedical className="text-green-400 text-xl" />
            ) : (
              <RiVirusLine className="text-red-400 text-xl" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {item.disease}
            </h3>
            <p className="text-gray-400 text-sm">
              {format(new Date(item.timestamp), 'MMM dd, yyyy - h:mm a')}
            </p>
          </div>
        </div>
        <FaChevronRight className="text-gray-400 mt-2" />
      </div>

      {item.image_url && (
        <div className="mt-4 relative h-60 w-full rounded-2xl overflow-hidden">
          <Image
            src={item.image_url}
            alt="Medical scan"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="mt-3">
        <h4 className="text-gray-300 font-medium mb-1">Top Predictions:</h4>
        <div className="flex flex-wrap gap-2">
          {item.prediction_data.top_5_diseases.map((disease, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs ${
                index === 0
                  ? 'bg-blue-900 text-blue-200'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {disease.disease} ({Math.round(disease.probability * 100)}%)
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
