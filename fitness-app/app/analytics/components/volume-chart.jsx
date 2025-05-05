"use client"

import { useState, useEffect, useRef } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function VolumeChart({ volumeData, weekLabels, isMobile }) {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

  // Generate random colors for each muscle group
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
    if (!volumeData || Object.keys(volumeData).length === 0) {
      setChartData({
        labels: weekLabels,
        datasets: [],
      })
      return
    }

    const datasets = Object.keys(volumeData).map((muscle, index) => ({
      label: muscle,
      data: volumeData[muscle],
      backgroundColor: generateColor(index),
      borderColor: generateColor(index).replace("0.7", "1"),
      borderWidth: 1,
    }))

    setChartData({
      labels: weekLabels,
      datasets,
    })
  }, [volumeData, weekLabels])

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
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Number of Sets",
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
      {chartData.datasets.length > 0 ? (
        <Bar ref={chartRef} data={chartData} options={options} />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">No data available. Select at least one muscle group.</p>
        </div>
      )}
    </div>
  )
}
