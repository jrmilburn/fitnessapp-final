"use client"

import { useState, useEffect } from "react"
import { MoreVertical, Plus, Trash2 } from "lucide-react"

export default function Set({ set, setProgram, exerciseId, viewonly, index }) {
  const [weight, setWeight] = useState(set?.weight || "")
  const [reps, setReps] = useState(set?.reps || "")
  const [confirmed, setConfirmed] = useState(set?.complete)
  const [menuOpen, setMenuOpen] = useState(false)

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

    setConfirmed(newCompleted)
    console.log(await response.json())
  }

  const removeSet = async () => {
    const response = await fetch(`/api/set/${set.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    if (response.ok) {
      // Remove the set with set.id from the program state
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
      // Assume the API returns the newly created set as JSON.
      const newSet = await response.json()

      // Update the program state by finding the exercise with the matching exerciseId
      // and appending the new set to its sets array.
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

  return (
    <div
      className={`grid grid-cols-12 gap-2 items-center py-2 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} rounded-md`}
    >
      {!viewonly && (
        <div className="col-span-1 relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
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
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className={`${viewonly ? "col-span-5" : "col-span-4"}`}>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          disabled={viewonly}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {!viewonly && (
        <div className="col-span-3 flex justify-center">
          <button
            onClick={updateSet}
            className={`w-6 h-6 rounded-md border ${
              confirmed ? "bg-green-500 border-green-600 text-white" : "bg-white border-gray-300 hover:bg-gray-100"
            } flex items-center justify-center transition-colors`}
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
