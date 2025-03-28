"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ chartData, options, muscle }) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        min: 0,
        suggestedMax: 20,
        ticks: { stepSize: 10 },
      },
    },
  };

  return (
    <div className="flex flex-col bg-white p-4 shadow-md rounded-lg border border-[black]/5">
      <h6 className="mb-2 text-center font-bold">{muscle}</h6>
      <div className="relative h-48">
        <Bar data={chartData} options={options || defaultOptions} />
      </div>
    </div>
  );
}
