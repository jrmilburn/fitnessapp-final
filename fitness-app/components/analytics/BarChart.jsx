"use client";
// components/BarChart.js
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
    responsive: false,
    plugins: {
      legend: { display: false }, // Disable legend
      title: { display: false },
    },
    scales: {
      y: {
        min: 0,
        suggestedMax: 20, // Default maximum is 20 unless data exceeds this value
        ticks: {
          stepSize: 10, // y-axis increments by 1
        },
      },
    },
  };

  return (
    <div className="relative flex gap-2 items-center h-[200px] w-full justify-between">
      <h6 className="absolute left-[-10%]">{muscle}</h6>
      <Bar data={chartData} options={options || defaultOptions} />
    </div>
  );
}
