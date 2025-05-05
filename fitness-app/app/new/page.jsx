"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ProgramStructure from "../../components/new/program-structure"
import WeekLayout from "../../components/new/week-layout"
import ProgramPreview from "../../components/new/program-preview"

export default function NewProgramPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("structure")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  // Program structure state
  const [programStructure, setProgramStructure] = useState({
    name: "",
    comments: "",
    length: 4,
    days: 2,
  })

  const [weekLayout, setWeekLayout] = useState(null)
  const [autoRegulated, setAutoRegulated] = useState(false)

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Generate the initial week layout based on program structure
  const generateLayout = () => {
    if (!programStructure.name) {
      showToast("Please provide a name for your program", "error")
      return false
    }

    const daysCount = programStructure.days
    const weeksCount = programStructure.length

    const workouts = []
    const weeks = []

    for (let i = 0; i < daysCount; i++) {
      workouts.push({
        name: `Day ${i + 1}`,
        workoutNo: i + 1,
        exercises: [],
      })
    }

    // Create a separate copy of the workouts array for each week
    for (let i = 0; i < weeksCount; i++) {
      weeks.push({
        weekNo: i + 1,
        workouts: JSON.parse(JSON.stringify(workouts)), // Deep clone
      })
    }

    setWeekLayout(weeks)
    setActiveTab("workouts")
    return true
  }

  // Create the program by sending data to the API
  const createProgram = async () => {
    if (!weekLayout || weekLayout.length === 0) {
      showToast("Please generate a workout layout first", "error")
      return
    }

    // Check if any workout has exercises
    const hasExercises = weekLayout.some((week) => week.workouts.some((workout) => workout.exercises.length > 0))

    if (!hasExercises) {
      showToast("Please add at least one exercise to your program", "error")
      return
    }

    try {
      setIsSubmitting(true)

      // Compute the final layout based on autoRegulated flag
      let finalWeekLayout = weekLayout
      if (autoRegulated && weekLayout && weekLayout.length > 0) {
        const currentWeek = weekLayout.find((week) => week.weekNo === 1)
        if (currentWeek) {
          finalWeekLayout = weekLayout.map((week) => ({
            ...currentWeek,
            weekNo: week.weekNo, // keep each week's original number
            workouts: currentWeek.workouts.map((workout) => ({
              ...workout,
              // Deep clone exercises to avoid shared references
              exercises: workout.exercises.map((exercise) => ({ ...exercise })),
            })),
          }))
        }
      }

      // Use finalWeekLayout in your fetch call
      const response = await fetch("/api/new-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekLayout: finalWeekLayout,
          programStructure,
          autoRegulated,
        }),
      })

      if (response.ok) {
        showToast("Your workout program has been created successfully")
        router.push("/workout")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to create program")
      }
    } catch (error) {
      showToast(error.message || "Something went wrong. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Create New Workout Program</h1>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "structure" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("structure")}
          >
            Program Structure
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "workouts" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
            } ${!weekLayout ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => weekLayout && setActiveTab("workouts")}
            disabled={!weekLayout}
          >
            Workout Design
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "preview" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
            } ${!weekLayout ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => weekLayout && setActiveTab("preview")}
            disabled={!weekLayout}
          >
            Preview & Create
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {activeTab === "structure" && (
          <div className="p-6">
            <ProgramStructure
              programStructure={programStructure}
              setProgramStructure={setProgramStructure}
              autoRegulated={autoRegulated}
              setAutoRegulated={setAutoRegulated}
            />

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                onClick={generateLayout}
              >
                {weekLayout ? "Update Layout" : "Generate Layout"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "workouts" && weekLayout && (
          <div className="p-6">
            <WeekLayout weekLayout={weekLayout} setWeekLayout={setWeekLayout} autoRegulated={autoRegulated} />

            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setActiveTab("structure")}
              >
                Back to Structure
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                onClick={() => setActiveTab("preview")}
              >
                Continue to Preview
              </button>
            </div>
          </div>
        )}

        {activeTab === "preview" && weekLayout && (
          <div className="p-6">
            <ProgramPreview programStructure={programStructure} weekLayout={weekLayout} autoRegulated={autoRegulated} />

            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setActiveTab("workouts")}
              >
                Back to Workouts
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                onClick={createProgram}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Program"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
