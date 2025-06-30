"use client"

import { useState } from "react"
import { History, X } from "lucide-react"

export default function ExerciseHistoryButton({ exerciseName, program, currentExercise, onAdoptHistory }) {
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  // Find the most recent completed exercise with the same name
  const getLastExerciseData = () => {
    if (!program || !exerciseName) return null

    let mostRecentExercise = null
    let mostRecentDate = null

    for (const week of program.weeks) {
      for (const workout of week.workouts) {
        for (const exercise of workout.exercises) {
          if (exercise.name === exerciseName && exercise.id !== currentExercise.id) {
            // Check if exercise has completed sets
            const hasCompletedSets = exercise.sets.some((set) => set.complete)
            if (hasCompletedSets) {
              const exerciseDate = new Date(exercise.createdAt)
              if (!mostRecentDate || exerciseDate > mostRecentDate) {
                mostRecentDate = exerciseDate
                mostRecentExercise = exercise
              }
            }
          }
        }
      }
    }

    return mostRecentExercise
  }

  const lastExercise = getLastExerciseData()

  if (!lastExercise) return null

  const handleAdoptHistory = () => {
    const historyData = lastExercise.sets
      .filter((set) => set.complete)
      .map((set, index) => ({
        setIndex: index,
        weight: set.weight,
        reps: set.reps,
      }))

    onAdoptHistory(historyData)
    setShowHistoryModal(false)
  }

  return (
    <>
      <button
        onClick={() => setShowHistoryModal(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-purple-100 border border-purple-300 hover:bg-purple-200 text-purple-700 text-sm font-medium transition-colors touch-manipulation"
        title={`View history for ${exerciseName}`}
      >
        <History className="h-4 w-4" />
        <span>Last Time</span>
      </button>

      {/* History Modal */}
      {showHistoryModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 z-50" onClick={() => setShowHistoryModal(false)} />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg shadow-xl border max-w-md w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Exercise History</h3>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">{exerciseName}</h4>
                  <p className="text-sm text-gray-600">
                    Last performed: {new Date(lastExercise.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Sets History */}
                <div className="space-y-2 mb-6">
                  <h5 className="text-sm font-medium text-gray-700">Previous Sets:</h5>
                  {lastExercise.sets
                    .filter((set) => set.complete)
                    .map((set, index) => (
                      <div key={set.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <span className="text-sm text-gray-600">Set {index + 1}</span>
                        <span className="font-medium">
                          {set.weight}kg × {set.reps} reps
                        </span>
                      </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleAdoptHistory}
                    className="flex-1 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 font-medium transition-colors"
                  >
                    Use These Values
                  </button>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
