"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, TrendingUp, Weight, BarChart3, Scale } from "lucide-react"

export default function ExerciseDetailCard({ exercise, exerciseData, weekLabels }) {
  const [expanded, setExpanded] = useState(false)

  if (!exerciseData) {
    return null
  }

  // Calculate progress metrics
  const calculateProgress = () => {
    if (!exerciseData || !exerciseData.weeks) {
      return {
        weightProgress: 0,
        repProgress: 0,
        volumeProgress: 0,
        oneRMProgress: 0,
      }
    }

    const nonEmptyWeeks = (exerciseData.weeks || []).filter((week) => week && week.sets > 0)

    if (nonEmptyWeeks.length < 2) {
      return {
        weightProgress: 0,
        repProgress: 0,
        volumeProgress: 0,
        oneRMProgress: 0,
      }
    }

    const firstWeek = nonEmptyWeeks[0]
    const lastWeek = nonEmptyWeeks[nonEmptyWeeks.length - 1]

    // Calculate average weight progress
    const firstWeekAvgWeight = firstWeek.sets > 0 ? firstWeek.totalWeight / firstWeek.sets : 0
    const lastWeekAvgWeight = lastWeek.sets > 0 ? lastWeek.totalWeight / lastWeek.sets : 0
    const weightProgress =
      firstWeekAvgWeight > 0 ? ((lastWeekAvgWeight - firstWeekAvgWeight) / firstWeekAvgWeight) * 100 : 0

    // Calculate average rep progress
    const firstWeekAvgReps = firstWeek.sets > 0 ? firstWeek.totalReps / firstWeek.sets : 0
    const lastWeekAvgReps = lastWeek.sets > 0 ? lastWeek.totalReps / lastWeek.sets : 0
    const repProgress = firstWeekAvgReps > 0 ? ((lastWeekAvgReps - firstWeekAvgReps) / firstWeekAvgReps) * 100 : 0

    // Calculate volume progress (sets)
    const volumeProgress = firstWeek.sets > 0 ? ((lastWeek.sets - firstWeek.sets) / firstWeek.sets) * 100 : 0

    // Calculate one-rep max progress
    const firstWeekOneRM = firstWeek.estimatedOneRM || 0
    const lastWeekOneRM = lastWeek.estimatedOneRM || 0
    const oneRMProgress = firstWeekOneRM > 0 ? ((lastWeekOneRM - firstWeekOneRM) / firstWeekOneRM) * 100 : 0

    return {
      weightProgress: Number.parseFloat(weightProgress.toFixed(1)),
      repProgress: Number.parseFloat(repProgress.toFixed(1)),
      volumeProgress: Number.parseFloat(volumeProgress.toFixed(1)),
      oneRMProgress: Number.parseFloat(oneRMProgress.toFixed(1)),
    }
  }

  const progress = calculateProgress()

  // Find max weight and max reps across all weeks
  const maxWeight = Math.max(...exerciseData.weeks.map((week) => week.maxWeight))
  const maxReps = Math.max(...exerciseData.weeks.map((week) => week.maxReps))

  // Find max estimated 1RM across all weeks
  const maxOneRM = Math.max(...exerciseData.weeks.map((week) => week.estimatedOneRM || 0))

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">{exercise}</h3>
            <p className="text-sm text-gray-500">{exerciseData.muscle}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Max Weight</div>
            <div className="font-medium">{maxWeight} kg</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Max Reps</div>
            <div className="font-medium">{maxReps}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Est. 1RM</div>
            <div className="font-medium">{maxOneRM > 0 ? `${maxOneRM.toFixed(1)} kg` : "N/A"}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Weight className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-sm">Weight Progress</span>
            </div>
            <div
              className={`text-sm font-medium ${
                progress.weightProgress > 0
                  ? "text-green-600"
                  : progress.weightProgress < 0
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {progress.weightProgress > 0 ? "+" : ""}
              {progress.weightProgress}%
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
              <span className="text-sm">Rep Progress</span>
            </div>
            <div
              className={`text-sm font-medium ${
                progress.repProgress > 0
                  ? "text-green-600"
                  : progress.repProgress < 0
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {progress.repProgress > 0 ? "+" : ""}
              {progress.repProgress}%
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-orange-600" />
              <span className="text-sm">Volume Progress</span>
            </div>
            <div
              className={`text-sm font-medium ${
                progress.volumeProgress > 0
                  ? "text-green-600"
                  : progress.volumeProgress < 0
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {progress.volumeProgress > 0 ? "+" : ""}
              {progress.volumeProgress}%
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Scale className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-sm">1RM Progress</span>
            </div>
            <div
              className={`text-sm font-medium ${
                progress.oneRMProgress > 0
                  ? "text-green-600"
                  : progress.oneRMProgress < 0
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {progress.oneRMProgress > 0 ? "+" : ""}
              {progress.oneRMProgress}%
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-2">Weekly Progression</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Week</th>
                    <th className="text-right py-2">Sets</th>
                    <th className="text-right py-2">Avg Weight</th>
                    <th className="text-right py-2">Avg Reps</th>
                    <th className="text-right py-2">Est. 1RM</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseData.weeks.map((week, index) => {
                    if (week.sets === 0) return null

                    const avgWeight = week.sets > 0 ? (week.totalWeight / week.sets).toFixed(1) : "-"
                    const avgReps = week.sets > 0 ? (week.totalReps / week.sets).toFixed(1) : "-"
                    const oneRM = week.estimatedOneRM > 0 ? week.estimatedOneRM.toFixed(1) : "-"

                    return (
                      <tr key={index} className="border-b border-gray-200 last:border-0">
                        <td className="py-2">{weekLabels[index]}</td>
                        <td className="text-right py-2">{week.sets}</td>
                        <td className="text-right py-2">{avgWeight} kg</td>
                        <td className="text-right py-2">{avgReps}</td>
                        <td className="text-right py-2">{oneRM} kg</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
