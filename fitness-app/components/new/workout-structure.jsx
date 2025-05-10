"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, GripVertical, Edit, Save, Search } from "lucide-react"
import { Droppable, Draggable } from "@hello-pangea/dnd"

export default function WorkoutStructure({ workout, weekIndex, workoutIndex, setWeekLayout }) {
  const [workoutName, setWorkoutName] = useState(workout.name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [showEditExercise, setShowEditExercise] = useState(false)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null)
  const [muscleGroups, setMuscleGroups] = useState([])
  const [exerciseTemplates, setExerciseTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [newExercise, setNewExercise] = useState({
    name: "",
    muscle: "",
    templateId: "",
    sets: [{ setNo: 1, reps: 10, weight: 0 }],
  })

  const [editingExercise, setEditingExercise] = useState(null)

  // Fetch muscle groups and exercise templates on component mount
  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await fetch("/api/muscle-groups")
        if (response.ok) {
          const data = await response.json()
          setMuscleGroups(data)
        }
      } catch (error) {
        console.error("Error fetching muscle groups:", error)
      }
    }

    fetchMuscleGroups()
  }, [])

  // Fetch exercise templates when adding or editing an exercise
  const fetchExerciseTemplates = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/exercise-templates")
      if (response.ok) {
        const data = await response.json()
        const allTemplates = [...data.defaultExercises, ...data.userExercises]
        setExerciseTemplates(allTemplates)
        setFilteredTemplates(allTemplates)
      }
    } catch (error) {
      console.error("Error fetching exercise templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter templates based on muscle group and search term
  useEffect(() => {
    if (exerciseTemplates.length > 0) {
      let filtered = [...exerciseTemplates]

      if (selectedMuscleGroup) {
        filtered = filtered.filter((template) => template.muscleGroup.id === selectedMuscleGroup)
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter((template) => template.name.toLowerCase().includes(term))
      }

      setFilteredTemplates(filtered)
    }
  }, [selectedMuscleGroup, searchTerm, exerciseTemplates])

  // Update workout name
  const updateWorkoutName = () => {
    setWeekLayout((prevLayout) => {
      const newLayout = [...prevLayout]
      newLayout[weekIndex].workouts[workoutIndex].name = workoutName
      return newLayout
    })
    setIsEditingName(false)
  }

  // Select an exercise template
  const selectExerciseTemplate = (template) => {
    setNewExercise({
      name: template.name,
      muscle: template.muscleGroup.name,
      templateId: template.id,
      sets: [{ setNo: 1, reps: 10, weight: 0 }],
    })
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
    if (!newExercise.name || !newExercise.templateId) return

    setWeekLayout((prevLayout) => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout))
      newLayout[weekIndex].workouts[workoutIndex].exercises.push({
        ...newExercise,
        exerciseNo: newLayout[weekIndex].workouts[workoutIndex].exercises.length,
        id: Date.now().toString(),
      })
      return newLayout
    })

    setNewExercise({
      name: "",
      muscle: "",
      templateId: "",
      sets: [{ setNo: 1, reps: 10, weight: 0 }],
    })
    setShowAddExercise(false)
    setSelectedMuscleGroup("")
    setSearchTerm("")
  }

  // Remove an exercise
  const removeExercise = (exerciseIndex) => {
    setWeekLayout((prevLayout) => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout))
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
      const newLayout = JSON.parse(JSON.stringify(prevLayout))
      newLayout[weekIndex].workouts[workoutIndex].exercises[editingExerciseIndex] = editingExercise
      return newLayout
    })

    setEditingExerciseIndex(null)
    setEditingExercise(null)
    setShowEditExercise(false)
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
    if (show) {
      fetchExerciseTemplates()
    } else {
      // Reset the new exercise form when closing
      setNewExercise({
        name: "",
        muscle: "",
        templateId: "",
        sets: [{ setNo: 1, reps: 10, weight: 0 }],
      })
      setSelectedMuscleGroup("")
      setSearchTerm("")
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
        <Droppable droppableId={`workout-${weekIndex}-${workoutIndex}`}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {workout.exercises.length > 0 ? (
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
                        key={exercise.id || `exercise-${weekIndex}-${workoutIndex}-${index}`}
                        draggableId={exercise.id || `exercise-${weekIndex}-${workoutIndex}-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <tr ref={provided.innerRef} {...provided.draggableProps} className="hover:bg-gray-50">
                            <td className="p-2">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                            </td>
                            <td className="py-2 font-medium">
                              {exercise.name}
                              <div className="text-xs text-gray-500">{exercise.muscle}</div>
                            </td>
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
              ) : (
                <div className="text-center py-4 text-gray-500">No exercises added yet</div>
              )}
            </div>
          )}
        </Droppable>

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
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Add Exercise</h3>

            <div className="space-y-4">
              {/* Search and filter */}
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="md:w-1/3">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedMuscleGroup}
                    onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                  >
                    <option value="">All Muscle Groups</option>
                    {muscleGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Exercise templates list */}
              <div className="border rounded-md overflow-hidden">
                {isLoading ? (
                  <div className="p-4 text-center">Loading exercise templates...</div>
                ) : filteredTemplates.length > 0 ? (
                  <div className="max-h-84 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Muscle Group
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTemplates.map((template) => (
                          <tr
                            key={template.id}
                            className={`hover:bg-gray-50 cursor-pointer ${
                              newExercise.templateId === template.id ? "bg-blue-50" : ""
                            }`}
                            onClick={() => selectExerciseTemplate(template)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{template.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{template.muscleGroup.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                className={`px-3 py-1 rounded-md ${
                                  newExercise.templateId === template.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  selectExerciseTemplate(template)
                                }}
                              >
                                {newExercise.templateId === template.id ? "Selected" : "Select"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">No exercise templates found</div>
                )}
              </div>

              {/* Selected exercise details */}
              {newExercise.templateId && (
                <div className="border rounded-md p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Selected Exercise: {newExercise.name}</h4>

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
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => toggleAddExerciseModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  newExercise.templateId
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={addExercise}
                disabled={!newExercise.templateId}
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
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="edit-muscle-group" className="block text-sm font-medium text-gray-700 mb-1">
                  Muscle Group
                </label>
                <input
                  id="edit-muscle-group"
                  value={editingExercise.muscle}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
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
