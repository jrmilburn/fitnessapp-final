"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import WorkoutStructure from "./workout-structure"

export default function WeekLayout({ weekLayout, setWeekLayout, autoRegulated }) {
  const [activeWeek, setActiveWeek] = useState("1")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Copy the current week's structure to all other weeks
  const copyToAllWeeks = () => {
    const weekIndex = Number.parseInt(activeWeek) - 1

    setWeekLayout((prevLayout) => {
      const currentWeek = prevLayout[weekIndex]
      if (!currentWeek) {
        console.error(`Week number ${weekIndex} not found in weekLayout`)
        return prevLayout
      }

      // Create a new layout by copying currentWeek.workouts to every other week
      const newLayout = prevLayout.map((week, index) => {
        if (index === weekIndex) {
          return week
        } else {
          const copiedWorkouts = currentWeek.workouts.map((workout) => ({
            ...workout,
            // Create a new array for exercises so future changes don't conflict
            exercises: JSON.parse(JSON.stringify(workout.exercises)),
          }))
          return {
            ...week,
            workouts: copiedWorkouts,
          }
        }
      })

      return newLayout
    })

    setShowConfirmDialog(false)
  }

  // If auto-regulated, only show the first week
  const displayedWeeks = autoRegulated ? weekLayout.slice(0, 1) : weekLayout

  return (
    <div className="space-y-6">
      {autoRegulated && (
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="text-sm">
            <strong>Auto-regulation enabled:</strong> Design your first week's workouts. The system will automatically
            adjust volume for subsequent weeks based on performance.
          </p>
        </div>
      )}

      {!autoRegulated && (
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
            {weekLayout.map((week) => (
              <button
                key={week.weekNo}
                className={`px-4 py-2 rounded-md ${
                  activeWeek === week.weekNo.toString()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveWeek(week.weekNo.toString())}
              >
                Week {week.weekNo}
              </button>
            ))}
          </div>

          <button
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => setShowConfirmDialog(true)}
          >
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy to All Weeks</span>
          </button>

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-medium mb-2">Copy Week Structure</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to copy Week {activeWeek}'s structure to all other weeks? This will overwrite
                  any existing workouts in other weeks.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    onClick={copyToAllWeeks}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!autoRegulated && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weekLayout[Number.parseInt(activeWeek) - 1]?.workouts.map((workout, workoutIndex) => (
            <WorkoutStructure
              key={`week-${activeWeek}-workout-${workout.workoutNo}`}
              workout={workout}
              weekIndex={Number.parseInt(activeWeek) - 1}
              workoutIndex={workoutIndex}
              setWeekLayout={setWeekLayout}
            />
          ))}
        </div>
      )}

      {autoRegulated && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedWeeks[0].workouts.map((workout, workoutIndex) => (
            <WorkoutStructure
              key={`week-1-workout-${workout.workoutNo}`}
              workout={workout}
              weekIndex={0}
              workoutIndex={workoutIndex}
              setWeekLayout={setWeekLayout}
            />
          ))}
        </div>
      )}
    </div>
  )
}
