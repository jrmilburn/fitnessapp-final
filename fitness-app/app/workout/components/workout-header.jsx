"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  MoreHorizontal,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Play,
  Dumbbell,
} from "lucide-react"
import ChangeWorkout from "./change-workout"
import ExerciseModal from "./exercise-modal"

export default function WorkoutHeader({ program, currentWorkout, setCurrentWorkout, setProgram, viewonly }) {
  const [currentWorkoutWeek, setCurrentWorkoutWeek] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [addExerciseShown, setAddExerciseShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Find current workout week
  useEffect(() => {
    if (program && currentWorkout) {
      const week = program.weeks.find((week) => week.workouts.some((workout) => workout.id === currentWorkout.id))
      setCurrentWorkoutWeek(week)
    }
  }, [program, currentWorkout])

  // Calculate workout progress
  const workoutProgress = useMemo(() => {
    if (!currentWorkout?.exercises) return { completed: 0, total: 0, percentage: 0 }

    const totalSets = currentWorkout.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0)
    const completedSets = currentWorkout.exercises.reduce(
      (acc, exercise) => acc + exercise.sets.filter((set) => set.complete).length,
      0,
    )

    return {
      completed: completedSets,
      total: totalSets,
      percentage: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0,
    }
  }, [currentWorkout])

  // Get workout status
  const workoutStatus = useMemo(() => {
    if (workoutProgress.percentage === 100) return "completed"
    if (workoutProgress.percentage > 0) return "in-progress"
    return "not-started"
  }, [workoutProgress.percentage])

  // Get status configuration
  const getStatusConfig = () => {
    switch (workoutStatus) {
      case "completed":
        return {
          icon: CheckCircle,
          label: "Completed",
          className: "bg-green-100 text-green-700 border-green-200",
          iconClassName: "text-green-600",
        }
      case "in-progress":
        return {
          icon: Clock,
          label: "In Progress",
          className: "bg-blue-100 text-blue-700 border-blue-200",
          iconClassName: "text-blue-600",
        }
      default:
        return {
          icon: Play,
          label: "Not Started",
          className: "bg-gray-100 text-gray-700 border-gray-200",
          iconClassName: "text-gray-600",
        }
    }
  }

  // Navigation helpers
  const getCurrentWorkoutIndex = () => {
    if (!program || !currentWorkout) return -1

    let index = 0
    for (const week of program.weeks) {
      for (const workout of week.workouts) {
        if (workout.id === currentWorkout.id) {
          return index
        }
        index++
      }
    }
    return -1
  }

  const getAllWorkouts = () => {
    if (!program) return []
    return program.weeks.flatMap((week) => week.workouts)
  }

  const navigateWorkout = (direction) => {
    const allWorkouts = getAllWorkouts()
    const currentIndex = getCurrentWorkoutIndex()

    if (currentIndex === -1) return

    const newIndex =
      direction === "prev" ? Math.max(0, currentIndex - 1) : Math.min(allWorkouts.length - 1, currentIndex + 1)

    if (newIndex !== currentIndex) {
      setCurrentWorkout(allWorkouts[newIndex])
    }
  }

  // Add exercise functionality
  const addExercise = async (selectedTemplate) => {
    if (!currentWorkout) return

    setIsLoading(true)
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

      const data = await response.json()
      setProgram(data.program)
      setAddExerciseShown(false)
    } catch (error) {
      console.error("Error adding exercise:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddExerciseClick = () => {
    setAddExerciseShown(true)
    setMenuOpen(false)
  }

  const handleCreateProgram = () => {
    router.push("/new")
    setMenuOpen(false)
  }

  // Navigation state
  const currentIndex = getCurrentWorkoutIndex()
  const allWorkouts = getAllWorkouts()
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < allWorkouts.length - 1

  // Status config
  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  // Menu items
  const menuItems = [
    {
      icon: Plus,
      label: "Add Exercise",
      action: handleAddExerciseClick,
      primary: true,
    },
    {
      icon: Calendar,
      label: "Create New Program",
      action: handleCreateProgram,
    },
  ]

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-start gap-3">
          {/* Left side - Workout info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                Week {currentWorkoutWeek?.weekNo}, {currentWorkout?.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{program?.name}</span>
                </div>
                {currentWorkout?.exercises && (
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-3.5 w-3.5" />
                    <span>{currentWorkout.exercises.length} exercises</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateWorkout("prev")}
                disabled={!canGoPrev}
                className={`p-1.5 rounded-md transition-colors touch-manipulation ${
                  canGoPrev ? "hover:bg-gray-100 active:bg-gray-200 text-gray-600" : "text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Previous workout"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <ChangeWorkout program={program} setCurrentWorkout={setCurrentWorkout} />

              <button
                onClick={() => navigateWorkout("next")}
                disabled={!canGoNext}
                className={`p-1.5 rounded-md transition-colors touch-manipulation ${
                  canGoNext ? "hover:bg-gray-100 active:bg-gray-200 text-gray-600" : "text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Next workout"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Menu */}
            {!viewonly && (
              <div className="relative">
                <button
                  className="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Workout options"
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </button>

                {menuOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                      {menuItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={index}
                            className={`flex items-center w-full px-4 py-3 text-sm transition-colors touch-manipulation ${
                              item.primary
                                ? "text-blue-700 hover:bg-blue-50 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={item.action}
                          >
                            <Icon className={`h-4 w-4 mr-3 ${item.primary ? "text-blue-600" : "text-gray-500"}`} />
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status and Progress */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            {/* Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}
            >
              <StatusIcon className={`h-3 w-3 ${statusConfig.iconClassName}`} />
              <span>{statusConfig.label}</span>
              {workoutStatus === "in-progress" && (
                <span className="text-xs opacity-75">({workoutProgress.percentage}%)</span>
              )}
            </div>

            {/* Progress percentage */}
            {workoutProgress.total > 0 && (
              <span className="text-xs text-gray-500 font-medium">{workoutProgress.percentage}% complete</span>
            )}
          </div>

          {/* Progress Bar */}
          {workoutProgress.total > 0 && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs text-gray-600">
                  {workoutProgress.completed}/{workoutProgress.total} sets
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    workoutProgress.percentage === 100
                      ? "bg-green-500"
                      : workoutProgress.percentage > 0
                        ? "bg-blue-500"
                        : "bg-gray-300"
                  }`}
                  style={{ width: `${workoutProgress.percentage}%` }}
                />
              </div>
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
        confirmButtonText={isLoading ? "Adding..." : "Add Exercise"}
        disabled={isLoading}
      />
    </div>
  )
}
