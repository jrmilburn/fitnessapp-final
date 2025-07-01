"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import Set from "./set"
import { MoreHorizontal, Edit, Trash2, RefreshCw, GripVertical, BarChart3, X, Calendar } from "lucide-react"
import ExerciseModal from "./exercise-modal"

export default function ExerciseWithHistoryFixed({ exercise, setProgram, program, workout, viewonly, index }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [changeExerciseModalOpen, setChangeExerciseModalOpen] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [updateAll, setUpdateAll] = useState(false)

  const currentExercise = program?.weeks
    .flatMap((week) => week.workouts)
    .flatMap((workout) => workout.exercises)
    .find((ex) => ex.id === exercise.id)

  const isExerciseComplete = currentExercise?.sets?.every((set) => set.complete)

  // Get exercise history from previous workouts
  const getExerciseHistory = () => {
    if (!program || !exercise.name) return []

    const history = []

    for (const week of program.weeks) {
      for (const workoutItem of week.workouts) {
        for (const exerciseItem of workoutItem.exercises) {
          if (exerciseItem.name === exercise.name && exerciseItem.id !== exercise.id) {
            const completedSets = exerciseItem.sets.filter((set) => set.complete)
            if (completedSets.length > 0) {
              history.push({
                date: new Date(exerciseItem.createdAt),
                weekNo: week.weekNo,
                workoutName: workoutItem.name,
                sets: completedSets.sort((a, b) => a.setNo - b.setNo),
                totalVolume: completedSets.reduce((sum, set) => sum + set.weight * set.reps, 0),
              })
            }
          }
        }
      }
    }

    return history.sort((a, b) => b.date - a.date) // Most recent first
  }

  const exerciseHistory = getExerciseHistory()

  // Debug: Log the history to console
  console.log(`Exercise: ${exercise.name}, History count: ${exerciseHistory.length}`, exerciseHistory)

  // Get the last completed set for smart placeholders
  const getLastCompletedSet = (currentIndex) => {
    const sortedSets = exercise?.sets?.slice().sort((a, b) => a.setNo - b.setNo) || []
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
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-gray-900">{exercise?.name}</h3>
                  <p className="text-sm text-gray-500">{exercise?.muscle}</p>
                </div>

                {/* History Button - Made more visible and always show for testing */}
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-blue-700"
                  title={
                    exerciseHistory.length > 0
                      ? `View history (${exerciseHistory.length} previous sessions)`
                      : "No history available"
                  }
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {exerciseHistory.length > 0 ? `${exerciseHistory.length}` : "0"}
                  </span>
                </button>
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

          {/* Exercise History Modal */}
          {showHistoryModal && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 bg-black/20 z-50" onClick={() => setShowHistoryModal(false)} />

              {/* Modal */}
              <div className="fixed inset-0 flex items-center justify-center z-60 p-4">
                <div className="bg-white rounded-lg shadow-xl border max-w-lg w-full max-h-[80vh] overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
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
                      <h4 className="font-medium text-gray-900 mb-1">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exerciseHistory.length > 0
                          ? `${exerciseHistory.length} previous sessions`
                          : "No previous sessions found"}
                      </p>
                    </div>

                    {/* History List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {exerciseHistory.length > 0 ? (
                        exerciseHistory.map((session, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{session.date.toLocaleDateString()}</span>
                                <span className="text-gray-400">•</span>
                                <span>
                                  Week {session.weekNo}, {session.workoutName}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">{Math.round(session.totalVolume)}kg total</div>
                            </div>

                            {/* Sets for this session */}
                            <div className="space-y-1">
                              {session.sets.map((set, setIndex) => (
                                <div key={set.id} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Set {setIndex + 1}</span>
                                  <span className="font-medium">
                                    {set.weight}kg × {set.reps} reps
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No previous sessions found</p>
                          <p className="text-xs mt-1">Complete this exercise in other workouts to see history</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => setShowHistoryModal(false)}
                      className="w-full px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </>
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
