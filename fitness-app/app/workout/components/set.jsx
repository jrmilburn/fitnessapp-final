"use client"

import { useState, useEffect, useMemo } from "react"
import { MoreVertical, Plus, Trash2, CheckCircle, Sparkles } from 'lucide-react'

export default function SetV4({
  set,
  setProgram,
  exerciseId,
  exerciseName,
  program,
  viewonly,
  index,
  previousCompletedSet,
  allSets,
}) {
  const [weight, setWeight] = useState(set?.weight || "")
  const [reps, setReps] = useState(set?.reps || "")
  const [confirmed, setConfirmed] = useState(set?.complete)
  const [menuOpen, setMenuOpen] = useState(false)

  // Find the most recent exercise instance and get all its completed sets
  const historicalExerciseData = useMemo(() => {
    if (!program || !exerciseName) return null

    let mostRecentExercise = null
    let mostRecentDate = null

    for (const week of program.weeks) {
      for (const workout of week.workouts) {
        for (const exercise of workout.exercises) {
          if (exercise.name === exerciseName && exercise.id !== exerciseId) {
            // Check if exercise has completed sets
            const hasCompletedSets = exercise.sets.some((set) => set.complete)
            if (hasCompletedSets) {
              const exerciseDate = new Date(exercise.createdAt)
              if (!mostRecentDate || exerciseDate > mostRecentDate) {
                mostRecentDate = exerciseDate
                mostRecentExercise = exercise
              }
            }
          }
        }
      }
    }

    if (!mostRecentExercise) return null

    // Get all completed sets, sorted by setNo or creation order
    const completedSets = mostRecentExercise.sets
      .filter((set) => set.complete)
      .sort((a, b) => a.setNo - b.setNo || new Date(a.createdAt) - new Date(b.createdAt))

    return {
      exercise: mostRecentExercise,
      completedSets,
      date: mostRecentDate,
    }
  }, [program, exerciseName, exerciseId])

  // Get the corresponding historical set for this current set based on index
  const correspondingHistoricalSet = useMemo(() => {
    if (!historicalExerciseData || !historicalExerciseData.completedSets) return null

    // Use the index to find the corresponding set from last time
    return historicalExerciseData.completedSets[index] || null
  }, [historicalExerciseData, index])

  // Check if this is a "new set" (no corresponding historical set)
  const isNewSet = useMemo(() => {
    return historicalExerciseData && !correspondingHistoricalSet
  }, [historicalExerciseData, correspondingHistoricalSet])

  // Enhanced smart placeholder logic - only for sets with corresponding historical data
  const getSmartPlaceholder = (field) => {
    if (correspondingHistoricalSet) {
      const value = field === "weight" ? correspondingHistoricalSet.weight : correspondingHistoricalSet.reps
      // For weight, add 2.5kg increment as placeholder suggestion
      return field === "weight" ? value + 2.5 : value
    }
    // No placeholder for new sets
    return ""
  }

  // Auto-focus next incomplete set when current set is completed
  useEffect(() => {
    if (confirmed && !viewonly) {
      const nextIncompleteSet = allSets?.find((s, idx) => idx > index && !s.complete)
      if (nextIncompleteSet) {
        setTimeout(() => {
          const nextSetElement = document.querySelector(`[data-set-id="${nextIncompleteSet.id}"] input[type="number"]`)
          if (nextSetElement) {
            nextSetElement.focus()
          }
        }, 100)
      }
    }
  }, [confirmed, allSets, index, viewonly])

  // Handle quick complete with proper value handling
  const handleQuickComplete = async () => {
    if (!confirmed) {
      // Use current values or placeholders, but don't concatenate
      let finalWeight = weight
      let finalReps = reps

      // If no values entered and we have historical data, use placeholders
      if (!finalWeight && correspondingHistoricalSet) {
        const placeholder = getSmartPlaceholder("weight")
        finalWeight = placeholder ? placeholder.toString() : "0"
      }
      if (!finalReps && correspondingHistoricalSet) {
        const placeholder = getSmartPlaceholder("reps")
        finalReps = placeholder ? placeholder.toString() : "0"
      }

      // For new sets without historical data, require manual input
      if (!finalWeight || !finalReps) {
        if (isNewSet) {
          // Don't auto-complete new sets without values
          return
        }
        finalWeight = finalWeight || "0"
        finalReps = finalReps || "0"
      }

      // Update local state first
      setWeight(finalWeight)
      setReps(finalReps)

      const response = await fetch("/api/set", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: Number.parseFloat(finalWeight) || 0,
          reps: Number.parseInt(finalReps) || 0,
          complete: true,
          setId: set.id,
        }),
      })

      if (response.ok) {
        setConfirmed(true)
      }
    } else {
      // Toggle completion
      updateSet()
    }
  }

  useEffect(() => {
    const targetSetId = set.id
    setProgram((prevProgram) => ({
      ...prevProgram,
      weeks: prevProgram.weeks.map((week) => ({
        ...week,
        workouts: week.workouts.map((workout) => ({
          ...workout,
          exercises: workout.exercises.map((exercise) => ({
            ...exercise,
            sets: exercise.sets.map((s) =>
              s.id === targetSetId
                ? {
                    ...s,
                    complete: confirmed,
                    weight: Number.parseFloat(weight) || 0,
                    reps: Number.parseInt(reps) || 0,
                  }
                : s,
            ),
          })),
        })),
      })),
    }))
  }, [confirmed, weight, reps, set.id, setProgram])

  const updateSet = async () => {
    const newCompleted = !confirmed
    const response = await fetch("/api/set", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weight: Number.parseFloat(weight) || 0,
        reps: Number.parseInt(reps) || 0,
        complete: newCompleted,
        setId: set.id,
      }),
    })

    if (response.ok) {
      setConfirmed(newCompleted)
    }
  }

  const removeSet = async () => {
    const response = await fetch(`/api/set/${set.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (response.ok) {
      setProgram((prevProgram) => ({
        ...prevProgram,
        weeks: prevProgram.weeks.map((week) => ({
          ...week,
          workouts: week.workouts.map((workout) => ({
            ...workout,
            exercises: workout.exercises.map((exercise) => ({
              ...exercise,
              sets: exercise.sets.filter((s) => s.id !== set.id),
            })),
          })),
        })),
      }))
      setMenuOpen(false)
    }
  }

  const addSet = async () => {
    const response = await fetch("/api/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weight: 0,
        reps: 0,
        complete: false,
        exerciseId: exerciseId,
      }),
    })

    if (response.ok) {
      const newSet = await response.json()
      setProgram((prevProgram) => ({
        ...prevProgram,
        weeks: prevProgram.weeks.map((week) => ({
          ...week,
          workouts: week.workouts.map((workout) => ({
            ...workout,
            exercises: workout.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                return {
                  ...exercise,
                  sets: [...exercise.sets, newSet.set],
                }
              }
              return exercise
            }),
          })),
        })),
      }))
      setMenuOpen(false)
    }
  }

  // Enhanced styling for better UX
  const getInputClassName = (hasValue) => {
    let baseClass =
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center font-medium"

    if (confirmed) {
      baseClass += " bg-green-50 border-green-300"
    } else if (!hasValue && correspondingHistoricalSet) {
      // Purple styling for sets with historical data
      baseClass += " border-purple-200 bg-purple-50"
    } else if (isNewSet) {
      // Orange styling for new sets
      baseClass += " border-orange-200 bg-orange-50"
    } else {
      baseClass += " border-gray-300"
    }

    return baseClass
  }

  return (
    <div
      className={`grid grid-cols-12 gap-3 items-center py-3 px-2 ${
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      } rounded-lg w-full ${confirmed ? "bg-green-50" : ""} relative`}
      data-set-id={set.id}
    >
      {/* Completed indicator - Fixed positioning to avoid overflow */}
      {confirmed && (
        <div className="absolute -top-1 right-2 z-10">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 shadow-sm">
            <CheckCircle className="h-3 w-3" />
            <span>Done</span>
          </div>
        </div>
      )}

      {/* New Set indicator */}
      {isNewSet && !confirmed && (
        <div className="absolute -top-1 right-2 z-10">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200 shadow-sm">
            <Sparkles className="h-3 w-3" />
            <span>New</span>
          </div>
        </div>
      )}

      {/* Set Menu */}
      {!viewonly && (
        <div className="col-span-1 relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute left-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-40 border border-gray-200">
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation"
                  onClick={addSet}
                >
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Add Set
                </button>
                <button
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 touch-manipulation"
                  onClick={removeSet}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete Set
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Weight Input */}
      <div className={`${viewonly ? "col-span-5" : "col-span-4"}`}>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          disabled={viewonly || confirmed}
          placeholder={getSmartPlaceholder("weight")}
          className={getInputClassName(weight)}
          step="0.5"
          min="0"
        />
      </div>

      {/* Reps Input */}
      <div className={`${viewonly ? "col-span-5" : "col-span-4"}`}>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          disabled={viewonly || confirmed}
          placeholder={getSmartPlaceholder("reps")}
          className={getInputClassName(reps)}
          min="0"
        />
      </div>

      {/* Complete Button */}
      {!viewonly && (
        <div className="col-span-3 flex justify-center">
          <button
            onClick={handleQuickComplete}
            className={`w-8 h-8 rounded-md border transition-all duration-200 touch-manipulation ${
              confirmed
                ? "bg-green-500 border-green-600 text-white shadow-sm"
                : (!weight || !reps) && correspondingHistoricalSet
                  ? "bg-purple-100 border-purple-300 hover:bg-purple-200"
                  : isNewSet
                    ? "bg-orange-100 border-orange-300 hover:bg-orange-200"
                    : "bg-white border-gray-300 hover:bg-gray-100"
            } flex items-center justify-center`}
            title={
              confirmed
                ? "Set completed - click to undo"
                : (!weight || !reps) && correspondingHistoricalSet
                  ? `Complete with suggested values: ${getSmartPlaceholder("weight")}kg × ${getSmartPlaceholder("reps")} reps`
                  : isNewSet
                    ? "New set - enter values to complete"
                    : "Mark as complete"
            }
          >
            {confirmed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
