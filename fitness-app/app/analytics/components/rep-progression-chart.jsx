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

export default function RepProgressionChart({ repData, weekLabels, isMobile }) {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

  // Generate random colors for each exercise
  const generateColor = (index) => {
    const colors = [
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 99, 132, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(199, 199, 199, 0.7)",
      "rgba(83, 102, 255, 0.7)",
      "rgba(255, 99, 255, 0.7)",
      "rgba(0, 162, 150, 0.7)",
    ]
    return colors[index % colors.length]
  }

  useEffect(() => {
    if (!repData || Object.keys(repData || {}).length === 0) {
      setChartData({
        labels: weekLabels || [],
        datasets: [],
      })
      return
    }

    const datasets = Object.keys(repData || {}).map((exercise, index) => {
      // Ensure we have valid data
      const data = repData[exercise] || []

      return {
        label: exercise,
        data: data,
        backgroundColor: generateColor(index),
        borderColor: generateColor(index).replace("0.7", "1"),
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.1,
        spanGaps: true, // Connect the line across null values
      }
    })

    setChartData({
      labels: weekLabels || [],
      datasets,
    })
  }, [repData, weekLabels])

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
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + " reps"
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: isMobile ? 8 : 10,
          },
          // Improve label display for longer program-week labels
          maxRotation: 90,
          minRotation: 45,
          autoSkip: true,
          autoSkipPadding: 15,
          callback: function (value, index) {
            // For many labels, show fewer ticks
            const labels = this.chart.data.labels
            if (labels.length > 12) {
              // Show every nth label based on total count
              const skipFactor = Math.ceil(labels.length / 12)
              return index % skipFactor === 0 ? labels[index] : ""
            }
            return labels[index]
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Reps",
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
          // Start y-axis at 0 to avoid misleading visuals
          beginAtZero: true,
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
          <p className="text-gray-500">No data available. Select at least one exercise.</p>
        </div>
      )}
    </div>
  )
}
