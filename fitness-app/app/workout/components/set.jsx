"use client"

import { useState, useEffect } from "react"
import { MoreVertical, Plus, Trash2 } from "lucide-react"

export default function Set({ set, setProgram, exerciseId, viewonly, index, previousCompletedSet, allSets }) {
  const [weight, setWeight] = useState(set?.weight || "")
  const [reps, setReps] = useState(set?.reps || "")
  const [confirmed, setConfirmed] = useState(set?.complete)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isUsingPlaceholder, setIsUsingPlaceholder] = useState(false)

  // Smart placeholder logic
  const getSmartPlaceholder = (field) => {
    if (previousCompletedSet) {
      return field === "weight" ? previousCompletedSet.weight : previousCompletedSet.reps
    }
    return "0"
  }

  // Auto-focus next incomplete set when current set is completed
  useEffect(() => {
    if (confirmed && !viewonly) {
      const nextIncompleteSet = allSets?.find((s, idx) => idx > index && !s.complete)
      if (nextIncompleteSet) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          const nextSetElement = document.querySelector(`[data-set-id="${nextIncompleteSet.id}"] input[type="number"]`)
          if (nextSetElement) {
            nextSetElement.focus()
          }
        }, 100)
      }
    }
  }, [confirmed, allSets, index, viewonly])

  // Handle placeholder usage
  const handleInputFocus = (field) => {
    if (!weight && !reps && previousCompletedSet && !confirmed) {
      if (field === "weight" && !weight) {
        setWeight(previousCompletedSet.weight.toString())
        setIsUsingPlaceholder(true)
      } else if (field === "reps" && !reps) {
        setReps(previousCompletedSet.reps.toString())
        setIsUsingPlaceholder(true)
      }
    }
  }

  // Handle quick complete with placeholders
  const handleQuickComplete = async () => {
    if (!confirmed && previousCompletedSet && (!weight || !reps)) {
      const finalWeight = weight || previousCompletedSet.weight.toString()
      const finalReps = reps || previousCompletedSet.reps.toString()

      setWeight(finalWeight)
      setReps(finalReps)

      // Update the set with placeholder values
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
  const getInputClassName = (hasValue, field) => {
    let baseClass =
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

    if (confirmed) {
      baseClass += " bg-green-50 border-green-300"
    } else if (!hasValue && previousCompletedSet) {
      baseClass += " border-blue-200 bg-blue-50"
    } else {
      baseClass += " border-gray-300"
    }

    return baseClass
  }

  return (
    <div
      className={`grid grid-cols-12 gap-2 items-center py-2 ${
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      } rounded-md w-full ${confirmed ? "bg-green-50" : ""}`}
      data-set-id={set.id}
    >
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
          onChange={(e) => {
            setWeight(e.target.value)
            setIsUsingPlaceholder(false)
          }}
          onFocus={() => handleInputFocus("weight")}
          disabled={viewonly}
          placeholder={getSmartPlaceholder("weight")}
          className={getInputClassName(weight, "weight")}
          step="0.5"
          min="0"
        />
      </div>

      <div className={`${viewonly ? "col-span-5" : "col-span-4"}`}>
        <input
          type="number"
          value={reps}
          onChange={(e) => {
            setReps(e.target.value)
            setIsUsingPlaceholder(false)
          }}
          onFocus={() => handleInputFocus("reps")}
          disabled={viewonly}
          placeholder={getSmartPlaceholder("reps")}
          className={getInputClassName(reps, "reps")}
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
                : previousCompletedSet && (!weight || !reps)
                  ? "bg-blue-100 border-blue-300 hover:bg-blue-200"
                  : "bg-white border-gray-300 hover:bg-gray-100"
            } flex items-center justify-center`}
            title={
              confirmed
                ? "Set completed"
                : previousCompletedSet && (!weight || !reps)
                  ? `Quick complete with ${getSmartPlaceholder("weight")}kg × ${getSmartPlaceholder("reps")} reps`
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
