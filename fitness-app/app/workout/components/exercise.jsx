"use client"

import { useState } from "react"
import Set from "./set"
import { MoreHorizontal, Edit, Trash2, RefreshCw } from "lucide-react"
import ExerciseSearch from "../../../components/ExerciseSearch"

export default function Exercise({ exercise, setProgram, program, workout, viewonly }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editModalShown, setEditModalShown] = useState(false)
  const [updateAll, setUpdateAll] = useState(false)

  const currentExercise = program?.weeks
    .flatMap((week) => week.workouts)
    .flatMap((workout) => workout.exercises)
    .find((ex) => ex.id === exercise.id)

  const isExerciseComplete = currentExercise?.sets?.every((set) => set.complete)

  const updateExercises = async (newExercise) => {
    const response = await fetch("/api/exercise", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newExercise.name,
        muscle: newExercise.muscle,
        workoutId: workout.id,
        all: updateAll,
        currentName: exercise.name,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      setProgram(data.program)
      setEditModalShown(false)
      setMenuOpen(false)
    }
  }

  const removeExercise = async () => {
    const response = await fetch("/api/exercise", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseId: exercise.id,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      setProgram(data.program)
      setMenuOpen(false)
    }
  }

  return (
    <>
      <div
        className={`bg-white p-4 border-b border-gray-200 ${
          isExerciseComplete && workout.programmed ? "border-l-4 border-l-green-500" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-medium text-gray-900">{exercise?.name}</h3>
            <p className="text-sm text-gray-500">{exercise?.muscle}</p>
          </div>

          {workout.programmed && !viewonly && (
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
                      setUpdateAll(true)
                      setEditModalShown(true)
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update All Upcoming
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setUpdateAll(false)
                      setEditModalShown(true)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update This Exercise
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={removeExercise}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Exercise
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {workout.programmed ? (
          <div className="mt-2">
            <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-500">
              <div className="col-span-1"></div>
              <div className="col-span-4">Weight</div>
              <div className="col-span-4">Reps</div>
              <div className="col-span-3 text-center">Done</div>
            </div>

            {exercise?.sets
              ?.slice()
              .sort((a, b) => a.setNo - b.setNo)
              .map((set, index) => (
                <Set
                  key={set.id || index}
                  set={set}
                  setProgram={setProgram}
                  exerciseId={exercise.id}
                  viewonly={viewonly}
                  index={index}
                />
              ))}
          </div>
        ) : (
          <div className="mt-4 py-3 px-4 bg-gray-50 rounded-md text-sm text-gray-600 italic">
            Sets not programmed for this exercise yet. Complete previous workouts to update sets.
          </div>
        )}
      </div>

      {/* Edit Exercise Modal */}
      {editModalShown && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-[10000] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-lg max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {updateAll ? "Update All Upcoming Exercises" : "Update Exercise"}
                </h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setEditModalShown(false)}>
                  &times;
                </button>
              </div>
            </div>
            <div className="p-4">
              <ExerciseSearch newExercise={updateExercises} setShown={setEditModalShown} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
