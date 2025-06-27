"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Plus, ChevronDown } from "lucide-react"
import ChangeWorkout from "./change-workout"

export default function WorkoutHeader({ program, currentWorkout, setCurrentWorkout, setProgram, viewonly }) {
  const [currentWorkoutWeek, setCurrentWorkoutWeek] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [addExerciseShown, setAddExerciseShown] = useState(false)
  const [exerciseTemplates, setExerciseTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [muscleGroups, setMuscleGroups] = useState([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (program && currentWorkout) {
      // Find the week that contains the current workout based on a unique identifier
      const week = program.weeks.find((week) => week.workouts.some((workout) => workout.id === currentWorkout.id))
      setCurrentWorkoutWeek(week)
    }
  }, [program, currentWorkout])

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

  const addExercise = async () => {
    if (!selectedTemplate) {
      console.error("Please select an exercise template")
      return
    }

    try {
      const response = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedTemplate.name,
          muscle: selectedTemplate.muscleGroup.name,
          workoutId: currentWorkout.id,
          templateId: selectedTemplate.id,
          programId: program.id
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add exercise")
      }

      const data = await response.json();

      setProgram(data.program)
      setAddExerciseShown(false)
      setSelectedTemplate(null)
      setSelectedMuscleGroup("")
      setSearchTerm("")
    } catch (error) {
      console.error("Error adding exercise:", error)
    }
  }

  const handleAddExerciseClick = () => {
    setAddExerciseShown(true)
    setMenuOpen(false)
    fetchData()
  }

  const handleCloseModal = () => {
    setAddExerciseShown(false)
    setSelectedTemplate(null)
    setSelectedMuscleGroup("")
    setSearchTerm("")
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
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
      {addExerciseShown && (
        <div className="fixed inset-0 bg-black/20 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Add Exercise</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={handleCloseModal}>
                  &times;
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">Select an exercise to add to your workout.</p>

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
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    selectedTemplate
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={addExercise}
                  disabled={!selectedTemplate}
                >
                  Add Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
