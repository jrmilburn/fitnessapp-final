"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import Set from "./set"
import { MoreHorizontal, Edit, Trash2, RefreshCw, GripVertical } from "lucide-react"
import { toast } from "react-hot-toast"

export default function Exercise({ exercise, setProgram, program, workout, viewonly, index }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [changeExerciseModalOpen, setChangeExerciseModalOpen] = useState(false)
  const [updateAll, setUpdateAll] = useState(false)
  const [exerciseTemplates, setExerciseTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [muscleGroups, setMuscleGroups] = useState([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const currentExercise = program?.weeks
    .flatMap((week) => week.workouts)
    .flatMap((workout) => workout.exercises)
    .find((ex) => ex.id === exercise.id)

  const isExerciseComplete = currentExercise?.sets?.every((set) => set.complete)

  // Fetch muscle groups and exercise templates
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch muscle groups
      const muscleGroupsResponse = await fetch("/api/muscle-groups")
      if (muscleGroupsResponse.ok) {
        const muscleGroupsData = await muscleGroupsResponse.json()
        setMuscleGroups(muscleGroupsData)
      }

      // Fetch exercise templates
      const templatesResponse = await fetch("/api/exercise-templates")
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json()
        const allTemplates = [...templatesData.defaultExercises, ...templatesData.userExercises]
        setExerciseTemplates(allTemplates)
        setFilteredTemplates(allTemplates)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load exercise templates")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter templates based on muscle group and search term
  const filterTemplates = () => {
    if (exerciseTemplates.length === 0) return

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

  // Update exercise with selected template
  const updateExercise = async () => {
    if (!selectedTemplate) {
      toast.error("Please select an exercise template")
      return
    }

    try {
      const response = await fetch("/api/exercise", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: exercise.id,
          templateId: selectedTemplate.id,
          updateAll: updateAll,
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
      setSelectedTemplate(null)
      setSelectedMuscleGroup("")
      setSearchTerm("")

      toast.success(updateAll ? "Updated all upcoming exercises" : "Updated exercise")
    } catch (error) {
      console.error("Error updating exercise:", error)
      toast.error("Failed to update exercise")
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
      toast.success("Exercise removed")
    } catch (error) {
      console.error("Error removing exercise:", error)
      toast.error("Failed to remove exercise")
    }
  }

  return (
    <Draggable draggableId={exercise.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white p-4 border-b border-gray-200 ${
            isExerciseComplete && workout.programmed ? "border-l-4 border-l-green-500" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {!viewonly && (
                <div {...provided.dragHandleProps} className="mr-2 cursor-grab">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setUpdateAll(true)
                        setChangeExerciseModalOpen(true)
                        fetchData()
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Change All Upcoming
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setUpdateAll(false)
                        setChangeExerciseModalOpen(true)
                        fetchData()
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

              {exercise?.sets
                ?.slice()
                .sort((a, b) => a.setNo - b.setNo)
                .map((set, setIndex) => (
                  <Set
                    key={set.id || setIndex}
                    set={set}
                    setProgram={setProgram}
                    exerciseId={exercise.id}
                    viewonly={viewonly}
                    index={setIndex}
                  />
                ))}
            </div>
          ) : (
            <div className="mt-4 py-3 px-4 bg-gray-50 rounded-md text-sm text-gray-600 italic">
              Sets not programmed for this exercise yet. Complete previous workouts to update sets.
            </div>
          )}

          {/* Change Exercise Modal */}
          {changeExerciseModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      {updateAll ? "Change All Upcoming Exercises" : "Change This Exercise"}
                    </h2>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setChangeExerciseModalOpen(false)}
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-4">
                      {updateAll
                        ? "This will change this exercise in all upcoming workouts."
                        : "This will only change this exercise in the current workout."}
                    </p>

                    {/* Search and filter */}
                    <div className="flex flex-col md:flex-row gap-2 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Search exercises..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setTimeout(filterTemplates, 300)
                          }}
                        />
                      </div>
                      <div className="md:w-1/3">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={selectedMuscleGroup}
                          onChange={(e) => {
                            setSelectedMuscleGroup(e.target.value)
                            setTimeout(filterTemplates, 300)
                          }}
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
                        <div className="max-h-60 overflow-y-auto">
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
                                    selectedTemplate?.id === template.id ? "bg-blue-50" : ""
                                  }`}
                                  onClick={() => setSelectedTemplate(template)}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{template.name}</div>
                                    {template.shortDescription && (
                                      <div className="text-sm text-gray-500 truncate max-w-xs">
                                        {template.shortDescription}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{template.muscleGroup.name}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                      className={`px-3 py-1 rounded-md ${
                                        selectedTemplate?.id === template.id
                                          ? "bg-blue-600 text-white"
                                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedTemplate(template)
                                      }}
                                    >
                                      {selectedTemplate?.id === template.id ? "Selected" : "Select"}
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
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => setChangeExerciseModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${
                        selectedTemplate
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={updateExercise}
                      disabled={!selectedTemplate}
                    >
                      {updateAll ? "Update All Upcoming" : "Update Exercise"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
