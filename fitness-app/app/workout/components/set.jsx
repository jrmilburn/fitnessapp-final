"use client"

import { useState, useEffect, useMemo } from "react"
import { MoreVertical, Plus, Trash2, History, Clock, CheckCircle } from "lucide-react"

export default function Set({
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
  const [showDataSource, setShowDataSource] = useState(false)

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
      }
    }
    if (previousCompletedSet) {
      return {
        type: "current",
        label: "Previous set",
        date: "This workout",
        icon: Clock,
        color: "blue",
      }
    }
    return null
  }

  const dataSource = getDataSource()

  // Enhanced smart placeholder logic
  const getSmartPlaceholder = (field) => {
    if (mostRecentCompletedSet) {
      return field === "weight" ? mostRecentCompletedSet.weight : mostRecentCompletedSet.reps
    }
    if (previousCompletedSet) {
      return field === "weight" ? previousCompletedSet.weight : previousCompletedSet.reps
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

  // Handle using placeholder values
  const useHistoricalData = () => {
    const referenceSet = mostRecentCompletedSet || previousCompletedSet
    if (referenceSet) {
      setWeight(referenceSet.weight.toString())
      setReps(referenceSet.reps.toString())
    }
  }

  // Handle quick complete with enhanced placeholder logic
  const handleQuickComplete = async () => {
    const referenceSet = mostRecentCompletedSet || previousCompletedSet

    if (!confirmed && referenceSet && (!weight || !reps)) {
      const finalWeight = weight || referenceSet.weight.toString()
      const finalReps = reps || referenceSet.reps.toString()

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
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

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
      className={`grid grid-cols-12 gap-2 items-center py-2 ${
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      } rounded-md w-full ${confirmed ? "bg-green-50" : ""} relative`}
      data-set-id={set.id}
    >
      {/* Data source indicator */}
      {!viewonly && dataSource && !confirmed && (!weight || !reps) && (
        <div className="absolute -top-1 -right-1 z-10">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${
              dataSource.type === "history"
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-blue-100 text-blue-700 border border-blue-200"
            }`}
            onClick={() => setShowDataSource(!showDataSource)}
            title={`Click to ${showDataSource ? "hide" : "show"} details`}
          >
            <dataSource.icon className="h-3 w-3" />
            <span>{dataSource.label}</span>
          </div>

          {showDataSource && (
            <div
              className={`absolute top-full right-0 mt-1 p-3 rounded-lg shadow-lg border z-20 min-w-48 ${
                dataSource.type === "history" ? "bg-purple-50 border-purple-200" : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="text-xs font-medium mb-2">
                {dataSource.type === "history" ? "Historical Data" : "Current Workout"}
              </div>
              <div className="text-xs text-gray-600 mb-2">From: {dataSource.date}</div>
              <div className="text-xs mb-3">
                Suggested: {getSmartPlaceholder("weight")}kg × {getSmartPlaceholder("reps")} reps
              </div>
              <button
                onClick={useHistoricalData}
                className={`w-full px-2 py-1 rounded text-xs font-medium transition-colors ${
                  dataSource.type === "history"
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Use These Values
              </button>
            </div>
          )}
        </div>
      )}

      {/* Completed indicator */}
      {confirmed && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </div>
        </div>
      )}

      {!viewonly && (
        <div className="col-span-1 relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors ml-2"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute left-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <button
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={addSet}
              >
                <Plus className="h-3.5 w-3.5 mr-2" />
                Add Set
              </button>
              <button
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={removeSet}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete Set
              </button>
            </div>
          )}
        </div>
      )}

      <div className={`${viewonly ? "col-span-5" : "col-span-4"}`}>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          disabled={viewonly}
          placeholder={getSmartPlaceholder("weight")}
          className={getInputClassName(weight)}
          step="0.5"
          min="0"
        />
      </div>

      <div className={`${viewonly ? "col-span-5" : "col-span-4"}`}>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          disabled={viewonly}
          placeholder={getSmartPlaceholder("reps")}
          className={getInputClassName(reps)}
          min="0"
        />
      </div>

      {!viewonly && (
        <div className="col-span-3 flex justify-center">
          <button
            onClick={handleQuickComplete}
            className={`w-6 h-6 rounded-md border transition-all duration-200 ${
              confirmed
                ? "bg-green-500 border-green-600 text-white shadow-sm"
                : dataSource && (!weight || !reps)
                  ? dataSource.type === "history"
                    ? "bg-purple-100 border-purple-300 hover:bg-purple-200"
                    : "bg-blue-100 border-blue-300 hover:bg-blue-200"
                  : "bg-white border-gray-300 hover:bg-gray-100"
            } flex items-center justify-center`}
            title={
              confirmed
                ? "Set completed"
                : dataSource && (!weight || !reps)
                  ? `Quick complete with suggested values (${dataSource.label})`
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
