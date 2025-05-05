"use client"

import { useState } from "react"

const muscleGroups = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Glutes", "Calves", "Abs", "Other"]

export default function ExerciseSearch({ newExercise, setShown }) {
  const [name, setName] = useState("")
  const [muscle, setMuscle] = useState("Chest")

  const handleSubmit = (e) => {
    e.preventDefault()
    newExercise({ name, muscle })
    setShown(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Exercise Name
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="muscle" className="block text-sm font-medium text-gray-700">
          Muscle Group
        </label>
        <select
          id="muscle"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
        >
          {muscleGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Exercise
        </button>
      </div>
    </form>
  )
}
