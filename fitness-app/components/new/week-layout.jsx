"use client"

import { useState } from "react"
import { Copy, CheckSquare, Square } from "lucide-react"
import WorkoutStructure from "./workout-structure"
import { DragDropContext } from "@hello-pangea/dnd"

export default function WeekLayout({ weekLayout, setWeekLayout }) {
  const [activeWeek, setActiveWeek] = useState("1")
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [selectedWeeks, setSelectedWeeks] = useState([])

  // Copy the current week's structure to selected weeks only
  const copyToSelectedWeeks = () => {
    const weekIndex = Number.parseInt(activeWeek) - 1

    setWeekLayout((prevLayout) => {
      const currentWeek = prevLayout[weekIndex]
      if (!currentWeek) {
        console.error(`Week number ${weekIndex} not found in weekLayout`)
        return prevLayout
      }

      // Create a new layout by copying currentWeek.workouts to selected weeks only
      const newLayout = prevLayout.map((week, index) => {
        // If this week is in selectedWeeks, copy the workouts
        if (selectedWeeks.includes(week.weekNo)) {
          const copiedWorkouts = JSON.parse(JSON.stringify(currentWeek.workouts))
          return {
            ...week,
            workouts: copiedWorkouts,
          }
        } else {
          // Leave other weeks unchanged
          return week
        }
      })

      return newLayout
    })

    // Close modal and clear selections
    setShowCopyModal(false)
    setSelectedWeeks([])
  }

  // Toggle week selection
  const toggleWeekSelection = (weekNo) => {
    setSelectedWeeks((prev) => (prev.includes(weekNo) ? prev.filter((w) => w !== weekNo) : [...prev, weekNo]))
  }

  const displayedWeeks = weekLayout

  // Handle drag end for exercises between workouts
  const handleDragEnd = (result) => {
    const { source, destination } = result

    // Drop outside a droppable area
    if (!destination) return

    // Parse the droppable IDs to get workout indexes
    // Format: "workout-{weekIndex}-{workoutIndex}"
    const sourceIdParts = source.droppableId.split("-")
    const destIdParts = destination.droppableId.split("-")

    const sourceWeekIndex = Number.parseInt(sourceIdParts[1])
    const sourceWorkoutIndex = Number.parseInt(sourceIdParts[2])
    const destWeekIndex = Number.parseInt(destIdParts[1])
    const destWorkoutIndex = Number.parseInt(destIdParts[2])

    setWeekLayout((prevLayout) => {
      // Create a deep copy to avoid mutation issues
      const newLayout = JSON.parse(JSON.stringify(prevLayout))

      // If moving within the same workout
      if (sourceWeekIndex === destWeekIndex && sourceWorkoutIndex === destWorkoutIndex) {
        const exercises = newLayout[sourceWeekIndex].workouts[sourceWorkoutIndex].exercises
        const [removed] = exercises.splice(source.index, 1)
        exercises.splice(destination.index, 0, removed)

        // Update exerciseNo for all exercises
        exercises.forEach((ex, idx) => {
          ex.exerciseNo = idx
        })
      }
      // If moving between different workouts
      else {
        // Get the exercise from source workout
        const sourceExercises = newLayout[sourceWeekIndex].workouts[sourceWorkoutIndex].exercises
        const [removed] = sourceExercises.splice(source.index, 1)

        // Add to destination workout
        const destExercises = newLayout[destWeekIndex].workouts[destWorkoutIndex].exercises
        destExercises.splice(destination.index, 0, removed)

        // Update exerciseNo for both source and destination workouts
        sourceExercises.forEach((ex, idx) => {
          ex.exerciseNo = idx
        })

        destExercises.forEach((ex, idx) => {
          ex.exerciseNo = idx
        })
      }

      return newLayout
    })
  }

  // Get other weeks (excluding active week)
  const otherWeeks = weekLayout.filter((week) => week.weekNo.toString() !== activeWeek)

  return (
    <div className="space-y-6">
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
          onClick={() => setShowCopyModal(true)}
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Copy week →</span>
        </button>

        {/* Copy Modal */}
        {showCopyModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4">Copy Week {activeWeek} to:</h3>

              <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                {otherWeeks.map((week) => (
                  <div
                    key={week.weekNo}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => toggleWeekSelection(week.weekNo)}
                  >
                    {selectedWeeks.includes(week.weekNo) ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="text-gray-700">Week {week.weekNo}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => {
                    setShowCopyModal(false)
                    setSelectedWeeks([])
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedWeeks.length > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                  }`}
                  onClick={copyToSelectedWeeks}
                  disabled={selectedWeeks.length === 0}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
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
      </DragDropContext>
    </div>
  )
}
