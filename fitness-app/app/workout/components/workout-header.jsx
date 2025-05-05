"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Plus, ChevronDown } from "lucide-react"
import ChangeWorkout from "./change-workout"
import ExerciseSearch from "../../../components/ExerciseSearch"

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

  const addExercise = async (newExercise) => {
    const response = await fetch("/api/exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newExercise.name,
        muscle: newExercise.muscle,
        workoutId: currentWorkout.id,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      setProgram(data.program)
      setAddExerciseShown(false)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setAddExerciseShown(true)
                      setMenuOpen(false)
                    }}
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
      {addExerciseShown && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-[10001] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-lg max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Add Exercise</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setAddExerciseShown(false)}>
                  &times;
                </button>
              </div>
            </div>
            <div className="p-4">
              <ExerciseSearch newExercise={addExercise} setShown={setAddExerciseShown} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
