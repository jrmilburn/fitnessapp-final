"use client"

import { useState, useEffect, useMemo } from "react"
import { MoreVertical, Plus, Trash2, History, Clock, CheckCircle, Minus } from "lucide-react"

export default function SetV2({
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
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  // Find the most recent completed set from the same exercise across all workouts
  const mostRecentCompletedSet = useMemo(() => {
    if (!program || !exerciseName) return null

    let mostRecentSet = null
    let mostRecentDate = null

    for (const week of program.weeks) {
      for (const workout of week.workouts) {
        for (const exercise of workout.exercises) {
          if (exercise.name === exerciseName) {
            for (const exerciseSet of exercise.sets) {
              if (exerciseSet.complete && exerciseSet.id !== set.id) {
                const setDate = new Date(exerciseSet.createdAt)
                if (!mostRecentDate || setDate > mostRecentDate) {
                  mostRecentDate = setDate
                  mostRecentSet = exerciseSet
                }
              }
            }
          }
        }
      }
    }

    return mostRecentSet
  }, [program, exerciseName, set.id])

  // Get data source information
  const getDataSource = () => {
    if (mostRecentCompletedSet) {
      const date = new Date(mostRecentCompletedSet.createdAt)
      return {
        type: "history",
        label: "Last time",
        date: date.toLocaleDateString(),
        icon: History,
        color: "purple",
        weight: mostRecentCompletedSet.weight,
        reps: mostRecentCompletedSet.reps,
      }
    }
    if (previousCompletedSet) {
      return {
        type: "current",
        label: "Previous set",
        date: "This workout",
        icon: Clock,
        color: "blue",
        weight: previousCompletedSet.weight,
        reps: previousCompletedSet.reps,
      }
    }
    return null
  }

  const dataSource = getDataSource()

  // Enhanced smart placeholder logic with increment
  const getSmartPlaceholder = (field) => {
    if (mostRecentCompletedSet) {
      const value = field === "weight" ? mostRecentCompletedSet.weight : mostRecentCompletedSet.reps
      // For weight, add 2.5kg increment as placeholder suggestion
      return field === "weight" ? value + 2.5 : value
    }
    if (previousCompletedSet) {
      const value = field === "weight" ? previousCompletedSet.weight : previousCompletedSet.reps
      return field === "weight" ? value + 2.5 : value
    }
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

  // Handle using historical data
  const useHistoricalData = () => {
    if (dataSource) {
      setWeight(dataSource.weight.toString())
      setReps(dataSource.reps.toString())
    }
    setShowHistoryModal(false)
  }

  // Handle using incremented placeholder values
  const useIncrementedValues = () => {
    const weightPlaceholder = getSmartPlaceholder("weight")
    const repsPlaceholder = getSmartPlaceholder("reps")
    if (weightPlaceholder) setWeight(weightPlaceholder.toString())
    if (repsPlaceholder) setReps(repsPlaceholder.toString())
  }

  // Weight increment/decrement functions
  const adjustWeight = (increment) => {
    const currentWeight = Number.parseFloat(weight) || 0
    const newWeight = Math.max(0, currentWeight + increment)
    setWeight(newWeight.toString())
  }

  // Reps increment/decrement functions
  const adjustReps = (increment) => {
    const currentReps = Number.parseInt(reps) || 0
    const newReps = Math.max(0, currentReps + increment)
    setReps(newReps.toString())
  }

  // Handle quick complete with enhanced placeholder logic
  const handleQuickComplete = async () => {
    if (!confirmed && (!weight || !reps)) {
      // Use incremented values if no input provided
      const finalWeight = weight || getSmartPlaceholder("weight").toString()
      const finalReps = reps || getSmartPlaceholder("reps").toString()

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
              s.id === targetSetId ? { ...s, complete: confirmed, weight: weight, reps: reps } : s,
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
    } else if (!hasValue && dataSource) {
      if (dataSource.type === "history") {
        baseClass += " border-purple-200 bg-purple-50"
      } else {
        baseClass += " border-blue-200 bg-blue-50"
      }
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
      {/* Completed indicator */}
      {confirmed && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 shadow-sm">
            <CheckCircle className="h-3 w-3" />
            <span>Done</span>
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

      {/* Weight Input with Controls */}
      <div className={`${viewonly ? "col-span-5" : "col-span-4"} space-y-2`}>
        <div className="flex items-center gap-1">
          {!viewonly && (
            <button
              onClick={() => adjustWeight(-2.5)}
              className="p-1.5 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
              disabled={confirmed}
            >
              <Minus className="h-3.5 w-3.5 text-gray-600" />
            </button>
          )}
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
          {!viewonly && (
            <button
              onClick={() => adjustWeight(2.5)}
              className="p-1.5 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
              disabled={confirmed}
            >
              <Plus className="h-3.5 w-3.5 text-gray-600" />
            </button>
          )}
        </div>
        <div className="text-xs text-center text-gray-500">kg</div>
      </div>

      {/* Reps Input with Controls */}
      <div className={`${viewonly ? "col-span-5" : "col-span-4"} space-y-2`}>
        <div className="flex items-center gap-1">
          {!viewonly && (
            <button
              onClick={() => adjustReps(-1)}
              className="p-1.5 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
              disabled={confirmed}
            >
              <Minus className="h-3.5 w-3.5 text-gray-600" />
            </button>
          )}
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            disabled={viewonly || confirmed}
            placeholder={getSmartPlaceholder("reps")}
            className={getInputClassName(reps)}
            min="0"
          />
          {!viewonly && (
            <button
              onClick={() => adjustReps(1)}
              className="p-1.5 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
              disabled={confirmed}
            >
              <Plus className="h-3.5 w-3.5 text-gray-600" />
            </button>
          )}
        </div>
        <div className="text-xs text-center text-gray-500">reps</div>
      </div>

      {/* Action Buttons */}
      {!viewonly && (
        <div className="col-span-3 flex flex-col items-center gap-3">
          {/* Complete Button */}
          <button
            onClick={handleQuickComplete}
            className={`w-8 h-8 rounded-md border transition-all duration-200 touch-manipulation ${
              confirmed
                ? "bg-green-500 border-green-600 text-white shadow-sm"
                : (!weight || !reps)
                  ? "bg-blue-100 border-blue-300 hover:bg-blue-200"
                  : "bg-white border-gray-300 hover:bg-gray-100"
            } flex items-center justify-center`}
            title={confirmed ? "Set completed" : "Mark as complete"}
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

          {/* History Button */}
          {dataSource && !confirmed && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className={`p-2 rounded-md border transition-all duration-200 touch-manipulation ${
                dataSource.type === "history"
                  ? "bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-700"
                  : "bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-700"
              }`}
              title={`Use values from ${dataSource.label.toLowerCase()}`}
            >
              <dataSource.icon className="h-4 w-4" />
            </button>
          )}

          {/* Use Incremented Values Button */}
          {!confirmed && (!weight || !reps) && (
            <button
              onClick={useIncrementedValues}
              className="px-2 py-1 rounded-md bg-green-100 border border-green-300 hover:bg-green-200 text-green-700 text-xs font-medium transition-colors touch-manipulation"
              title="Use suggested incremented values"
            >
              +2.5kg
            </button>
          )}
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && dataSource && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 z-50" onClick={() => setShowHistoryModal(false)} />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-60 p-4">
            <div
              className={`p-4 rounded-lg shadow-xl border max-w-sm w-full ${
                dataSource.type === "history" ? "bg-purple-50 border-purple-200" : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <dataSource.icon
                  className={`h-5 w-5 ${dataSource.type === "history" ? "text-purple-600" : "text-blue-600"}`}
                />
                <h3 className="font-medium text-gray-900">
                  {dataSource.type === "history" ? "Historical Data" : "Current Workout"}
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">From: {dataSource.date}</div>
                <div className="text-lg font-semibold">
                  {dataSource.weight}kg × {dataSource.reps} reps
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={useHistoricalData}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    dataSource.type === "history"
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Use These Values
                </button>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
