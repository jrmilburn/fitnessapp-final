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

export default function WeightRepCorrelationChart({ weightData, repData, weekLabels, exerciseName, isMobile }) {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    if (!weightData || !repData || weightData.length === 0 || repData.length === 0) {
      setChartData({
        labels: weekLabels,
        datasets: [],
      })
      return
    }

    // Create datasets for weight and reps
    const datasets = [
      {
        label: "Weight (kg)",
        data: weightData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        yAxisID: "y",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.1,
        spanGaps: true,
      },
      {
        label: "Reps",
        data: repData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y1",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.1,
        spanGaps: true,
      },
    ]

    setChartData({
      labels: weekLabels,
      datasets,
    })
  }, [weightData, repData, weekLabels])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
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
        text: exerciseName ? `Weight vs Reps: ${exerciseName}` : "Weight vs Reps Correlation",
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
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Weight (kg)",
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
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Reps",
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        grid: {
          drawOnChartArea: false,
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
      {chartData.datasets.length > 0 ? (
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">
            {exerciseName
              ? `No data available for ${exerciseName}. Select another exercise.`
              : "No data available. Select an exercise."}
          </p>
        </div>
      )}
    </div>
  )
}
