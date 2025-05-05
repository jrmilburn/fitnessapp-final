"use client"

import { useState } from "react"
import Exercise from "./exercise"
import FeedbackForm from "./feedback-form"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function Workout({ workout, setProgram, program, setCurrentWorkout, viewonly }) {
  const [expandedMuscleGroup, setExpandedMuscleGroup] = useState(null)

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No workout selected</h2>
        <p className="text-gray-600 text-center">Please select a workout from the program or create a new one.</p>
      </div>
    )
  }

  // Group exercises by muscle
  const exercisesByMuscle = workout.exercises.reduce((groups, exercise) => {
    const muscle = exercise.muscle || "Other"
    if (!groups[muscle]) {
      groups[muscle] = []
    }
    groups[muscle].push(exercise)
    return groups
  }, {})

  // Check if all exercises are complete
  const isWorkoutComplete = workout.exercises.every((exercise) => exercise.sets.every((set) => set.complete))

  return (
    <div className="w-full mx-auto flex flex-col">
      {/* Workout status indicator */}
      <div
        className={`mb-4 p-3 rounded-lg flex items-center ${
          isWorkoutComplete ? "bg-green-50 text-green-800" : "bg-blue-50 text-blue-800"
        }`}
      >
        {isWorkoutComplete ? (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Workout complete! Great job!</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Complete all sets to finish this workout</span>
          </>
        )}
      </div>

      {/* Exercises grouped by muscle */}
      {Object.entries(exercisesByMuscle).map(([muscle, exercises]) => (
        <div key={muscle} className="mb-4">
          <div
            className="bg-gray-100 p-3 rounded-t-lg font-medium text-gray-700 flex justify-between items-center cursor-pointer"
            onClick={() => setExpandedMuscleGroup(expandedMuscleGroup === muscle ? null : muscle)}
          >
            <span>{muscle}</span>
            <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-full">
              {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"}
            </span>
          </div>

          <div className={`${expandedMuscleGroup === muscle || expandedMuscleGroup === null ? "block" : "hidden"}`}>
            {exercises.map((exercise, index) => (
              <Exercise
                key={exercise.id || index}
                exercise={exercise}
                setProgram={setProgram}
                program={program}
                workout={workout}
                viewonly={viewonly}
              />
            ))}
          </div>
        </div>
      ))}

      {workout?.programmed && (
        <FeedbackForm
          program={program}
          setCurrentWorkout={setCurrentWorkout}
          workout={workout}
          setProgram={setProgram}
        />
      )}
    </div>
  )
}
