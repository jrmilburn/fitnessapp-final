"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, Edit, Save } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

export default function WorkoutStructure({ workout, weekIndex, workoutIndex, setWeekLayout }) {
  const [workoutName, setWorkoutName] = useState(workout.name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [showEditExercise, setShowEditExercise] = useState(false)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null)

  const [newExercise, setNewExercise] = useState({
    name: "",
    muscle: "Chest", // Default muscle group
    sets: [{ setNo: 1, reps: 10, weight: 0 }],
  })

  const [editingExercise, setEditingExercise] = useState(null)

  // Available muscle groups
  const muscleGroups = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Glutes", "Calves", "Abs", "Other"]

  // Update workout name
  const updateWorkoutName = () => {
    setWeekLayout((prevLayout) => {
      const newLayout = [...prevLayout]
      newLayout[weekIndex].workouts[workoutIndex].name = workoutName
      return newLayout
    })
    setIsEditingName(false)
  }

  // Add a new set to the new exercise
  const addSet = () => {
    setNewExercise({
      ...newExercise,
      sets: [
        ...newExercise.sets,
        {
          setNo: newExercise.sets.length + 1,
          reps: 10,
          weight: newExercise.sets[newExercise.sets.length - 1]?.weight || 0,
        },
      ],
    })
  }

  // Remove a set from the new exercise
  const removeSet = (setIndex) => {
    setNewExercise({
      ...newExercise,
      sets: newExercise.sets
        .filter((_, index) => index !== setIndex)
        .map((set, index) => ({
          ...set,
          setNo: index + 1,
        })),
    })
  }

  // Add a new exercise
  const addExercise = () => {
    if (!newExercise.name) return;
  
    setWeekLayout(prev =>
      prev.map((week, wIdx) =>
        wIdx === weekIndex
          ? {
              ...week,
              workouts: week.workouts.map((w, wi) =>
                wi === workoutIndex
                  ? {
                      ...w,
                      exercises: [
                        ...w.exercises,
                        {
                          ...newExercise,
                          exerciseNo: w.exercises.length,
                        },
                      ],
                    }
                  : w
              ),
            }
          : week
      )
    );
  
    // reset form / close modal
    setNewExercise({ name: "", muscle: "Chest", sets: [{ setNo: 1, reps: 10, weight: 0 }] });
    setShowAddExercise(false);
  };
  

  // Remove an exercise
  const removeExercise = (exerciseIndex) => {
    setWeekLayout((prevLayout) => {
      const newLayout = [...prevLayout]
      newLayout[weekIndex].workouts[workoutIndex].exercises.splice(exerciseIndex, 1)
      // Update exerciseNo for remaining exercises
      newLayout[weekIndex].workouts[workoutIndex].exercises.forEach((ex, idx) => {
        ex.exerciseNo = idx
      })
      return newLayout
    })
  }

  // Start editing an exercise
  const startEditExercise = (exerciseIndex) => {
    setEditingExerciseIndex(exerciseIndex)
    setEditingExercise(JSON.parse(JSON.stringify(workout.exercises[exerciseIndex])))
    setShowEditExercise(true)
  }

  // Add a set to the editing exercise
  const addEditingSet = () => {
    setEditingExercise({
      ...editingExercise,
      sets: [
        ...editingExercise.sets,
        {
          setNo: editingExercise.sets.length + 1,
          reps: 10,
          weight: editingExercise.sets[editingExercise.sets.length - 1]?.weight || 0,
        },
      ],
    })
  }

  // Remove a set from the editing exercise
  const removeEditingSet = (setIndex) => {
    setEditingExercise({
      ...editingExercise,
      sets: editingExercise.sets
        .filter((_, index) => index !== setIndex)
        .map((set, index) => ({
          ...set,
          setNo: index + 1,
        })),
    })
  }

  // Save edited exercise
  const saveEditedExercise = () => {
    if (editingExerciseIndex === null || !editingExercise) return

    setWeekLayout((prevLayout) => {
      const newLayout = [...prevLayout]
      newLayout[weekIndex].workouts[workoutIndex].exercises[editingExerciseIndex] = editingExercise
      return newLayout
    })

    setEditingExerciseIndex(null)
    setEditingExercise(null)
    setShowEditExercise(false)
  }

  // Handle drag and drop reordering
  const onDragEnd = (result) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    setWeekLayout((prevLayout) => {
      const newLayout = [...prevLayout]
      const exercises = [...newLayout[weekIndex].workouts[workoutIndex].exercises]
      const [removed] = exercises.splice(sourceIndex, 1)
      exercises.splice(destinationIndex, 0, removed)

      // Update exerciseNo for all exercises
      exercises.forEach((ex, idx) => {
        ex.exerciseNo = idx
      })

      newLayout[weekIndex].workouts[workoutIndex].exercises = exercises
      return newLayout
    })
  }

  // Update a set in the new exercise
  const updateNewExerciseSet = (setIndex, field, value) => {
    const updatedSets = [...newExercise.sets]
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: field === "weight" || field === "reps" ? Number(value) : value,
    }
    setNewExercise({
      ...newExercise,
      sets: updatedSets,
    })
  }

  // Update a set in the editing exercise
  const updateEditingExerciseSet = (setIndex, field, value) => {
    const updatedSets = [...editingExercise.sets]
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: field === "weight" || field === "reps" ? Number(value) : value,
    }
    setEditingExercise({
      ...editingExercise,
      sets: updatedSets,
    })
  }

  const toggleAddExerciseModal = (show) => {
    if (!show) {
      // Reset the new exercise form when closing
      setNewExercise({
        name: "",
        muscle: "Chest",
        sets: [{ setNo: 1, reps: 10, weight: 0 }],
      })
    }
    setShowAddExercise(show)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        {isEditingName ? (
          <div className="flex gap-2">
            <input
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="p-1 text-gray-500 hover:text-gray-700" onClick={updateWorkoutName}>
              <Save className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{workout.name}</h3>
            <button className="p-1 text-gray-500 hover:text-gray-700" onClick={() => setIsEditingName(true)}>
              <Edit className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        {workout.exercises.length > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={`workout-${workoutIndex}`}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="w-[30px]"></th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                          Exercise
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                          Sets × Reps
                        </th>
                        <th className="w-[50px]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {workout.exercises.map((exercise, index) => (
                        <Draggable
                          key={index}
                          draggableId={exercise.id || `exercise-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <tr ref={provided.innerRef} {...provided.draggableProps} className="hover:bg-gray-50">
                              <td className="p-2">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                </div>
                              </td>
                              <td className="py-2 font-medium">{exercise.name}</td>
                              <td className="py-2 text-right text-gray-500">
                                {exercise.sets?.length || 0} × {exercise.sets?.[0]?.reps || 0}
                              </td>
                              <td className="p-2">
                                <div className="flex gap-1">
                                  <button
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={() => startEditExercise(index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="text-gray-400 hover:text-red-600"
                                    onClick={() => removeExercise(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="text-center py-4 text-gray-500">No exercises added yet</div>
        )}

        <button
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
          onClick={() => toggleAddExerciseModal(true)}
        >
          <Plus className="h-4 w-4" />
          Add Exercise
        </button>
      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-[10000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Add New Exercise</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="exercise-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise Name
                </label>
                <input
                  id="exercise-name"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  placeholder="e.g., Bench Press"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="muscle-group" className="block text-sm font-medium text-gray-700 mb-1">
                  Muscle Group
                </label>
                <select
                  id="muscle-group"
                  value={newExercise.muscle}
                  onChange={(e) => setNewExercise({ ...newExercise, muscle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {muscleGroups.map((muscle) => (
                    <option key={muscle} value={muscle}>
                      {muscle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Sets</label>
                  <button type="button" onClick={addSet} className="text-blue-600 hover:text-blue-800 text-sm">
                    + Add Set
                  </button>
                </div>

                {newExercise.sets.map((set, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <div className="w-10 text-center text-sm font-medium text-gray-500">#{set.setNo}</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateNewExerciseSet(index, "reps", e.target.value)}
                        placeholder="Reps"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateNewExerciseSet(index, "weight", e.target.value)}
                        placeholder="Weight (kg)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {newExercise.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSet(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => toggleAddExerciseModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addExercise()
                }}
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exercise Modal */}
      {showEditExercise && editingExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Edit Exercise</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="edit-exercise-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise Name
                </label>
                <input
                  id="edit-exercise-name"
                  value={editingExercise.name}
                  onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="edit-muscle-group" className="block text-sm font-medium text-gray-700 mb-1">
                  Muscle Group
                </label>
                <select
                  id="edit-muscle-group"
                  value={editingExercise.muscle}
                  onChange={(e) => setEditingExercise({ ...editingExercise, muscle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {muscleGroups.map((muscle) => (
                    <option key={muscle} value={muscle}>
                      {muscle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Sets</label>
                  <button type="button" onClick={addEditingSet} className="text-blue-600 hover:text-blue-800 text-sm">
                    + Add Set
                  </button>
                </div>

                {editingExercise.sets.map((set, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <div className="w-10 text-center text-sm font-medium text-gray-500">#{set.setNo}</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateEditingExerciseSet(index, "reps", e.target.value)}
                        placeholder="Reps"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateEditingExerciseSet(index, "weight", e.target.value)}
                        placeholder="Weight (kg)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {editingExercise.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEditingSet(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowEditExercise(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={saveEditedExercise}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
