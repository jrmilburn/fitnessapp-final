"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Plus, ChevronDown } from "lucide-react"
import ChangeWorkout from "./change-workout"
import ExerciseModal from "./exercise-modal"

export default function WorkoutHeader({ program, currentWorkout, setCurrentWorkout, setProgram, viewonly }) {
  const [currentWorkoutWeek, setCurrentWorkoutWeek] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [addExerciseShown, setAddExerciseShown] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (program && currentWorkout) {
      // Find the week that contains the current workout based on a unique identifier
      const week = program.weeks.find((week) => week.workouts.some((workout) => workout.id === currentWorkout.id))
      setCurrentWorkoutWeek(week)
    }
  }, [program, currentWorkout])

  const addExercise = async (selectedTemplate) => {
    try {
      const response = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedTemplate.name,
          muscle: selectedTemplate.muscleGroup.name,
          workoutId: currentWorkout.id,
          templateId: selectedTemplate.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add exercise")
      }

      const data = await response.json()
      setProgram(data.program)
      setAddExerciseShown(false)
    } catch (error) {
      console.error("Error adding exercise:", error)
    }
  }

  const handleAddExerciseClick = () => {
    setAddExerciseShown(true)
    setMenuOpen(false)
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center p-4">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-gray-900">
            Week {currentWorkoutWeek?.weekNo}, {currentWorkout?.name}
          </h1>
          <p className="text-sm text-gray-500">{program?.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <ChangeWorkout program={program} setCurrentWorkout={setCurrentWorkout} />

          {!viewonly && (
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleAddExerciseClick}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => router.push("/new")}
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Create New Program
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Exercise Modal */}
      <ExerciseModal
        isOpen={addExerciseShown}
        onClose={() => setAddExerciseShown(false)}
        onConfirm={addExercise}
        title="Add Exercise"
        description="Select an exercise to add to your workout."
        confirmButtonText="Add Exercise"
      />
    </div>
  )
}
