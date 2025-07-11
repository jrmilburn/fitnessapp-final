"use client"

import { useState, useEffect, useCallback } from "react"
import VolumeChart from "./volume-chart"
import WeightProgressionChart from "./weight-progression-chart"
import RepProgressionChart from "./rep-progression-chart"
import ExerciseDetailCard from "./exercise-detail-card"
import MuscleGroupDistribution from "./muscle-group-distribution"
import WeightRepCorrelationChart from "./weight-rep-correlation-chart"
import ExerciseProgressionChart from "./exercise-progression-chart"
import OneRepMaxChart from "./one-rep-max-chart"
import {
  ChevronDown,
  BarChart3,
  LineChart,
  PieChart,
  Dumbbell,
  Activity,
  TrendingUp,
  Scale,
  Calendar,
} from "lucide-react"

export default function AnalyticsDashboard({ allPrograms, currentProgramId, processedData }) {
  const [activeTab, setActiveTab] = useState("volume")
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([])
  const [selectedExercises, setSelectedExercises] = useState([])
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedExercise, setSelectedExercise] = useState("")
  const [muscleFilterOpen, setMuscleFilterOpen] = useState(false)
  const [exerciseFilterOpen, setExerciseFilterOpen] = useState(false)
  const [programFilterOpen, setProgramFilterOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeProcessedData, setActiveProcessedData] = useState(processedData)

  // Update the chart container height to accommodate longer labels
  const updateChartContainerHeight = (activeTab, isDateBased, totalWeeks) => {
    // For "All Programs" view with many weeks, we need more height
    if (selectedProgram === "all" && totalWeeks > 8) {
      return "h-[500px]" // Taller chart for many weeks
    }
    return "h-[400px]" // Default height
  }

  // Replace the processClientSideData function with this improved version
  const processClientSideData = useCallback(
    (programId) => {
      console.log("Processing client-side data for program:", programId)

      // For both "all" and specific program IDs, we'll make an API call
      // to get the properly processed data
      fetch(`/api/program-analytics?programId=${programId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error fetching program data: ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          console.log("Received data for program:", programId, data)
          setActiveProcessedData({
            ...processedData,
            currentProgramData: data.currentProgramData,
          })

          // Reset filters when switching programs
          if (data.currentProgramData?.muscleGroups?.length > 0) {
            setSelectedMuscleGroups(data.currentProgramData.muscleGroups)
          }
          if (data.currentProgramData?.exercises?.length > 0) {
            setSelectedExercises(data.currentProgramData.exercises.slice(0, 5))
          }
        })
        .catch((error) => {
          console.error("Error fetching program data:", error)
        })

      // Return the current data while we wait for the fetch to complete
      return processedData
    },
    [allPrograms, processedData],
  )

  // Add this useEffect after the other state declarations (around line 30)
  useEffect(() => {
    // Set the initial program selection after component mounts
    if (selectedProgram === "" && currentProgramId) {
      setSelectedProgram(currentProgramId)
      console.log("Setting initial program selection:", currentProgramId)
    }
  }, [currentProgramId, selectedProgram])

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Initialize with all muscle groups selected
  useEffect(() => {
    if (activeProcessedData.currentProgramData?.muscleGroups?.length > 0 && selectedMuscleGroups.length === 0) {
      setSelectedMuscleGroups(activeProcessedData.currentProgramData.muscleGroups)
    }
  }, [activeProcessedData.currentProgramData?.muscleGroups, selectedMuscleGroups])

  // Initialize with top 5 exercises selected
  useEffect(() => {
    if (activeProcessedData.currentProgramData?.exercises?.length > 0 && selectedExercises.length === 0) {
      setSelectedExercises(activeProcessedData.currentProgramData.exercises.slice(0, 5))
    }

    // Set the first exercise as the selected exercise for progression tracking
    if (processedData.exercises.length > 0 && !selectedExercise) {
      setSelectedExercise(processedData.exercises[0])
    }
  }, [activeProcessedData.currentProgramData?.exercises, selectedExercises, processedData.exercises, selectedExercise])

  const toggleMuscleGroup = (muscle) => {
    if (selectedMuscleGroups.includes(muscle)) {
      setSelectedMuscleGroups(selectedMuscleGroups.filter((m) => m !== muscle))
    } else {
      setSelectedMuscleGroups([...selectedMuscleGroups, muscle])
    }
  }

  const toggleExercise = (exercise) => {
    if (selectedExercises.includes(exercise)) {
      setSelectedExercises(selectedExercises.filter((e) => e !== exercise))
    } else {
      setSelectedExercises([...selectedExercises, exercise])
    }
  }

  const selectAllMuscleGroups = () => {
    setSelectedMuscleGroups([...activeProcessedData.currentProgramData.muscleGroups])
  }

  const clearMuscleGroups = () => {
    setSelectedMuscleGroups([])
  }

  const selectAllExercises = () => {
    setSelectedExercises([...activeProcessedData.currentProgramData.exercises])
  }

  const clearExercises = () => {
    setSelectedExercises([])
  }

  // Also update the handleProgramChange function to be simpler
  const handleProgramChange = (programId) => {
    console.log("Changing program from:", selectedProgram, "to:", programId)
    setSelectedProgram(programId)

    // Process the data for the selected program
    processClientSideData(programId)
    setProgramFilterOpen(false)
  }

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise)
  }

  // Get current program name
  const currentProgram = allPrograms.find((p) => p.id === selectedProgram)
  const currentProgramName = currentProgram ? currentProgram.name : "All Programs"

  // Update the filtering logic in the dashboard to handle the filtered data properly
  // Add this function to filter out weeks with no data for the selected filters

  // In the filtering section, update the code to filter out weeks with no data for the selected filters
  // Replace the existing filtering code with this improved version:

  // Filter volume data based on selected muscle groups
  const filteredVolumeData = {}
  Object.keys(activeProcessedData.currentProgramData?.volumeData || {}).forEach((muscle) => {
    if (selectedMuscleGroups.includes(muscle)) {
      // Only include this muscle group if it has data
      const muscleData = activeProcessedData.currentProgramData.volumeData[muscle]
      if (muscleData && muscleData.some((value) => value > 0)) {
        filteredVolumeData[muscle] = muscleData
      }
    }
  })

  // Filter weight data based on selected exercises
  const filteredWeightData = {}
  Object.keys(activeProcessedData.currentProgramData?.weightData || {}).forEach((exercise) => {
    if (selectedExercises.includes(exercise)) {
      // Only include this exercise if it has data
      const exerciseData = activeProcessedData.currentProgramData.weightData[exercise]
      if (exerciseData && exerciseData.some((value) => value !== null)) {
        filteredWeightData[exercise] = exerciseData
      }
    }
  })

  // Filter rep data based on selected exercises
  const filteredRepData = {}
  Object.keys(activeProcessedData.currentProgramData?.repData || {}).forEach((exercise) => {
    if (selectedExercises.includes(exercise)) {
      // Only include this exercise if it has data
      const exerciseData = activeProcessedData.currentProgramData.repData[exercise]
      if (exerciseData && exerciseData.some((value) => value !== null)) {
        filteredRepData[exercise] = exerciseData
      }
    }
  })

  // Custom tab component
  const TabButton = ({ value, icon, label }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
        activeTab === value
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  useEffect(() => {
    // Initialize with the current program ID passed from the server
    // Only set it if selectedProgram is not already set (initial load)
    if (currentProgramId && selectedProgram !== currentProgramId && selectedProgram === "") {
      setSelectedProgram(currentProgramId)
    }

    // Update the UI when the selected program changes
    if (selectedProgram === "all") {
      // For "all" selection, we need to update the UI accordingly
      document.title = "All Programs - Analytics"
    } else {
      const program = allPrograms.find((p) => p.id === selectedProgram)
      if (program) {
        document.title = `${program.name} - Analytics`
      }
    }
  }, [currentProgramId, selectedProgram, allPrograms])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Workout Analytics</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-gray-600">{currentProgramName} - Progress Tracking</p>

          <div className="relative">
            <button
              onClick={() => setProgramFilterOpen(!programFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4" />
              <span>{selectedProgram === "all" ? "All Programs" : currentProgramName}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {programFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-3">
                <div className="max-h-60 overflow-y-auto">
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="program-all"
                      checked={selectedProgram === "all"}
                      onChange={() => handleProgramChange("all")}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="program-all" className="ml-2 text-sm text-gray-700">
                      All Programs
                    </label>
                  </div>

                  {allPrograms.map((program) => (
                    <div key={program.id} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`program-${program.id}`}
                        checked={selectedProgram === program.id}
                        onChange={() => handleProgramChange(program.id)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`program-${program.id}`} className="ml-2 text-sm text-gray-700">
                        {program.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        {/* Custom Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <TabButton value="volume" icon={<BarChart3 className="h-4 w-4" />} label="Volume" />
            <TabButton value="distribution" icon={<PieChart className="h-4 w-4" />} label="Distribution" />
            <TabButton value="exercises" icon={<Dumbbell className="h-4 w-4" />} label="Exercises" />
          </div>
        </div>

        <div className="p-4">
          {/* Volume Tab */}
          {activeTab === "volume" && (
            <div className="mt-0">
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-lg font-medium">Set Volume by Muscle Group</h2>
                  <div className="relative">
                    <button
                      onClick={() => setMuscleFilterOpen(!muscleFilterOpen)}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <span>Filter Muscle Groups</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {muscleFilterOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-3">
                        <div className="flex justify-between mb-2">
                          <button onClick={selectAllMuscleGroups} className="text-sm text-blue-600 hover:text-blue-800">
                            Select All
                          </button>
                          <button onClick={clearMuscleGroups} className="text-sm text-red-600 hover:text-red-800">
                            Clear All
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {activeProcessedData.currentProgramData.muscleGroups.map((muscle) => (
                            <div key={muscle} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id={`muscle-${muscle}`}
                                checked={selectedMuscleGroups.includes(muscle)}
                                onChange={() => toggleMuscleGroup(muscle)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor={`muscle-${muscle}`} className="ml-2 text-sm text-gray-700">
                                {muscle}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={updateChartContainerHeight(
                    activeTab,
                    activeProcessedData.currentProgramData?.isDateBased,
                    activeProcessedData.currentProgramData?.totalWeeks,
                  )}
                >
                  <VolumeChart
                    volumeData={filteredVolumeData}
                    weekLabels={activeProcessedData.currentProgramData?.weekLabels}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Distribution Tab */}
          {activeTab === "distribution" && (
            <div className="mt-0">
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-4">Training Volume Distribution</h2>
                <div
                  className={updateChartContainerHeight(
                    activeTab,
                    activeProcessedData.currentProgramData?.isDateBased,
                    activeProcessedData.currentProgramData?.totalWeeks,
                  )}
                >
                  <MuscleGroupDistribution
                    volumeData={activeProcessedData.currentProgramData?.volumeData}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Exercises Tab */}
          {activeTab === "exercises" && (
            <div className="mt-0">
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-4">Exercise Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedExercises.map((exercise) => (
                    <ExerciseDetailCard
                      key={exercise}
                      exercise={exercise}
                      exerciseData={activeProcessedData.currentProgramData?.exerciseData[exercise]}
                      weekLabels={activeProcessedData.currentProgramData?.weekLabels}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
