"use client"

import { useState, useEffect, useRef } from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

export default function MuscleGroupDistribution({ volumeData, isMobile }) {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

  // Generate colors for each muscle group
  const generateColors = (count) => {
    const baseColors = [
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

    const backgroundColors = []
    const borderColors = []

    for (let i = 0; i < count; i++) {
      const color = baseColors[i % baseColors.length]
      backgroundColors.push(color)
      borderColors.push(color.replace("0.7", "1"))
    }

    return { backgroundColors, borderColors }
  }

  useEffect(() => {
    if (!volumeData || Object.keys(volumeData).length === 0) {
      setChartData({
        labels: [],
        datasets: [],
      })
      return
    }

    // Calculate total sets per muscle group across all weeks
    const totalSets = {}
    Object.keys(volumeData).forEach((muscle) => {
      totalSets[muscle] = volumeData[muscle].reduce((sum, sets) => sum + sets, 0)
    })

    // Sort muscles by total sets (descending)
    const sortedMuscles = Object.keys(totalSets).sort((a, b) => totalSets[b] - totalSets[a])
    const sortedSets = sortedMuscles.map((muscle) => totalSets[muscle])

    // Generate colors
    const { backgroundColors, borderColors } = generateColors(sortedMuscles.length)

    setChartData({
      labels: sortedMuscles,
      datasets: [
        {
          data: sortedSets,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    })
  }, [volumeData])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? "bottom" : "right",
        labels: {
          boxWidth: 12,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ""
            const value = context.raw || 0
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} sets (${percentage}%)`
          },
        },
      },
    },
  }

  return (
    <div className="h-full w-full flex items-center justify-center">
      {chartData.labels.length > 0 ? (
        <Pie ref={chartRef} data={chartData} options={options} />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">No data available.</p>
        </div>
      )}
    </div>
  )
}
