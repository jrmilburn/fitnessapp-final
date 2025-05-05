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

export default function OneRepMaxChart({ exerciseData, selectedExercises, weekLabels, isMobile }) {
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
    if (!exerciseData || Object.keys(exerciseData).length === 0 || selectedExercises.length === 0) {
      setChartData({
        labels: weekLabels,
        datasets: [],
      })
      return
    }

    const datasets = selectedExercises
      .filter((exercise) => exerciseData[exercise])
      .map((exercise, index) => {
        // Calculate estimated 1RM for each week
        const oneRMData = exerciseData[exercise].weeks.map((week) => {
          if (week.maxWeight === 0 || week.maxReps === 0) return null

          // Use Brzycki formula: weight * (36 / (37 - reps))
          // Limit to 10 reps for accuracy
          const reps = Math.min(week.maxReps, 10)
          return week.maxWeight * (36 / (37 - reps))
        })

        return {
          label: exercise,
          data: oneRMData,
          backgroundColor: generateColor(index),
          borderColor: generateColor(index).replace("0.7", "1"),
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
          spanGaps: true,
        }
      })

    setChartData({
      labels: weekLabels,
      datasets,
    })
  }, [exerciseData, selectedExercises, weekLabels])

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
              label += context.parsed.y.toFixed(1) + " kg"
            }
            return label
          },
        },
      },
      title: {
        display: true,
        text: "Estimated One-Rep Max Progression",
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
          text: "Estimated 1RM (kg)",
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
        <Line ref={chartRef} data={chartData} options={options} />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-gray-500">No data available. Select at least one exercise.</p>
        </div>
      )}
    </div>
  )
}
