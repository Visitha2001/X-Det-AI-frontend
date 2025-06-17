'use client';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function PieChart({ data }: { data: any }) {
  return <Pie data={data} />;
}

export function BarChart({ data }: { data: any }) {
  return <Bar data={data} />;
}