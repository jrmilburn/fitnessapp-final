"use client"

import { useState, useEffect, useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function ExerciseProgressionChart({ exerciseData, isMobile }) {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })
  const [chartType, setChartType] = useState("weight") // weight, reps, oneRM

  useEffect(() => {
    if (
      !exerciseData ||
      !exerciseData.timeSeriesData ||
      !Array.isArray(exerciseData.timeSeriesData) ||
      exerciseData.timeSeriesData.length === 0
    ) {
      setChartData({
        labels: [],
        datasets: [],
      })
      return
    }

    // Extract labels (months)
    const labels = exerciseData.timeSeriesData
      .map((data) => {
        if (!data || !data.month) return ""
        const [year, month] = (data.month || "").split("-")
        return `${month}/${year?.slice(2) || ""}`
      })
      .filter(Boolean)

    // Create datasets based on chart type
    let datasets = []

    if (chartType === "weight") {
      datasets = [
        {
          label: "Average Weight (kg)",
          data: exerciseData.timeSeriesData.map((data) => data?.avgWeight || null),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
          spanGaps: true,
        },
        {
          label: "Max Weight (kg)",
          data: exerciseData.timeSeriesData.map((data) => data?.maxWeight || null),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
          spanGaps: true,
          borderDash: [5, 5],
        },
      ]
    } else if (chartType === "reps") {
      datasets = [
        {
          label: "Average Reps",
          data: exerciseData.timeSeriesData.map((data) => data?.avgReps || null),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
          spanGaps: true,
        },
        {
          label: "Max Reps",
          data: exerciseData.timeSeriesData.map((data) => data?.maxReps || null),
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
          spanGaps: true,
          borderDash: [5, 5],
        },
      ]
    } else if (chartType === "oneRM") {
      datasets = [
        {
          label: "Estimated One-Rep Max (kg)",
          data: exerciseData.timeSeriesData.map((data) => data?.estimatedOneRM || null),
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.5)",
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
          spanGaps: true,
        },
      ]
    }

    setChartData({
      labels,
      datasets,
    })
  }, [exerciseData, chartType])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? "bottom" : "top",
        labels: {
          boxWidth: 12,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      title: {
        display: true,
        text: `${exerciseData?.muscle || ""} - ${exerciseData?.name || ""} Progression`,
        font: {
          size: isMobile ? 14 : 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: chartType === "weight" ? "Weight (kg)" : chartType === "reps" ? "Reps" : "Estimated 1RM (kg)",
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
    },
  }

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setChartType("weight")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              chartType === "weight"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Weight
          </button>
          <button
            type="button"
            onClick={() => setChartType("reps")}
            className={`px-4 py-2 text-sm font-medium ${
              chartType === "reps"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300"
            }`}
          >
            Reps
          </button>
          <button
            type="button"
            onClick={() => setChartType("oneRM")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              chartType === "oneRM"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            One-Rep Max
          </button>
        </div>
      </div>

      {chartData.datasets.length > 0 ? (
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">No progression data available for this exercise.</p>
        </div>
      )}
    </div>
  )
}
