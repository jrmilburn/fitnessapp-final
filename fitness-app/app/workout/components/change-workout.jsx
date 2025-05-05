"use client"

import { useState } from "react"
import { Calendar, X } from "lucide-react"

export default function ChangeWorkout({ program, setCurrentWorkout }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Change workout"
      >
        <Calendar className="h-5 w-5 text-gray-600" />
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{program?.name}</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {[...(program?.weeks || [])]
                  .sort((a, b) => a.weekNo - b.weekNo)
                  .map((week) => (
                    <div key={week.weekNo} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b border-gray-200">
                        <h3 className="font-medium">Week {week?.weekNo}</h3>
                      </div>

                      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[...(week?.workouts || [])]
                          .sort((a, b) => a.workoutNo - b.workoutNo)
                          .map((workout) => {
                            const isWorkoutComplete =
                              workout.exercises.every((exercise) => exercise.sets.every((set) => set.complete)) &&
                              workout.programmed

                            return (
                              <button
                                key={workout.id}
                                className={`p-3 border rounded-md text-center transition-colors ${
                                  isWorkoutComplete
                                    ? "bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                                    : workout.programmed
                                      ? "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
                                      : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
                                }`}
                                onClick={() => {
                                  setCurrentWorkout(workout)
                                  setModalOpen(false)
                                }}
                              >
                                <div className="font-medium">{workout.name}</div>
                                <div className="text-xs mt-1">
                                  {isWorkoutComplete ? "Completed" : workout.programmed ? "In Progress" : "Not Started"}
                                </div>
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
