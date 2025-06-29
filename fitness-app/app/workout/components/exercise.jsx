"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import Set from "./set"
import { MoreHorizontal, Edit, Trash2, RefreshCw, GripVertical } from "lucide-react"
import ExerciseModal from "./exercise-modal"

export default function Exercise({ exercise, setProgram, program, workout, viewonly, index }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [changeExerciseModalOpen, setChangeExerciseModalOpen] = useState(false)
  const [updateAll, setUpdateAll] = useState(false)

  const currentExercise = program?.weeks
    .flatMap((week) => week.workouts)
    .flatMap((workout) => workout.exercises)
    .find((ex) => ex.id === exercise.id)

  const isExerciseComplete = currentExercise?.sets?.every((set) => set.complete)

  // Get the last completed set for smart placeholders
  const getLastCompletedSet = (currentIndex) => {
    const sortedSets = exercise?.sets?.slice().sort((a, b) => a.setNo - b.setNo) || []

    // Look for the most recent completed set before the current index
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (sortedSets[i]?.complete && sortedSets[i]?.weight && sortedSets[i]?.reps) {
        return sortedSets[i]
      }
    }
    return null
  }

  const updateExercise = async (selectedTemplate, shouldUpdateAll) => {
    try {
      const response = await fetch("/api/exercise", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: exercise.id,
          templateId: selectedTemplate.id,
          updateAll: shouldUpdateAll,
          workoutId: workout.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update exercise")
      }

      const data = await response.json()
      setProgram(data.program)
      setChangeExerciseModalOpen(false)
      setMenuOpen(false)

      console.log(shouldUpdateAll ? "Updated all upcoming exercises" : "Updated exercise")
    } catch (error) {
      console.error("Error updating exercise:", error)
    }
  }

  const removeExercise = async () => {
    try {
      const response = await fetch("/api/exercise", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: exercise.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete exercise")
      }

      const data = await response.json()
      setProgram(data.program)
      setMenuOpen(false)
      console.log("Exercise removed")
    } catch (error) {
      console.error("Error removing exercise:", error)
    }
  }

  const sortedSets = exercise?.sets?.slice().sort((a, b) => a.setNo - b.setNo) || []

  return (
    <Draggable draggableId={exercise.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white pt-4 border-b border-gray-200 ${
            isExerciseComplete && workout.programmed ? "border-l-4 border-l-green-500" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {!viewonly && (
                <div {...provided.dragHandleProps} className="mr-2 cursor-grab ml-2">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{exercise?.name}</h3>
                <p className="text-sm text-gray-500">{exercise?.muscle}</p>
              </div>
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setUpdateAll(true)
                        setChangeExerciseModalOpen(true)
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Change All Upcoming
                    </button>
                    <button
                      className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setUpdateAll(false)
                        setChangeExerciseModalOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Change This Exercise
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

              {sortedSets.map((set, setIndex) => (
                <Set
                  key={set.id || setIndex}
                  set={set}
                  setProgram={setProgram}
                  exerciseId={exercise.id}
                  viewonly={viewonly}
                  index={setIndex}
                  previousCompletedSet={getLastCompletedSet(setIndex)}
                  allSets={sortedSets}
                  program={program}
                  exerciseName={exercise.name}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 py-3 px-4 bg-gray-50 rounded-md text-sm text-gray-600 italic">
              Sets not programmed for this exercise yet. Complete previous workouts to update sets.
            </div>
          )}

          {/* Change Exercise Modal */}
          <ExerciseModal
            isOpen={changeExerciseModalOpen}
            onClose={() => setChangeExerciseModalOpen(false)}
            onConfirm={updateExercise}
            title={updateAll ? "Change All Upcoming Exercises" : "Change This Exercise"}
            description={
              updateAll
                ? "This will change this exercise in all upcoming workouts."
                : "This will only change this exercise in the current workout."
            }
            confirmButtonText={updateAll ? "Update All Upcoming" : "Update Exercise"}
            showUpdateAllOption={true}
            updateAll={updateAll}
            onUpdateAllChange={setUpdateAll}
          />
        </div>
      )}
    </Draggable>
  )
}
