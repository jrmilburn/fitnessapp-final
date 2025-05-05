"use client"

import { useEffect, useState } from "react"
import NextWorkout from "./next-workout"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FeedbackForm({ program, setCurrentWorkout, workout, setProgram }) {
  // Find the current workout from the program data
  const currentWorkout = program?.weeks?.flatMap((week) => week.workouts).find((w) => w.id === workout?.id)

  // Determine if all exercises in the workout are complete
  const isWorkoutComplete = currentWorkout?.exercises?.every((exercise) => exercise?.sets.every((set) => set.complete))

  const [formShown, setFormShown] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // This state holds the feedback data:
  // muscles: an object keyed by muscle name with ratings for workload, jointpain, and soreness
  // overallFatigue: a single rating value (1-10)
  const [feedbackData, setFeedbackData] = useState({
    muscles: {},
    overallFatigue: "",
  })

  // When the currentWorkout is available, initialize feedback entries for each unique muscle.
  useEffect(() => {
    if (currentWorkout && currentWorkout.exercises) {
      const uniqueMuscles = Array.from(new Set(currentWorkout.exercises.map((e) => e.muscle)))
      const musclesFeedback = {}
      uniqueMuscles.forEach((muscle) => {
        musclesFeedback[muscle] = { workload: "", jointpain: "", soreness: "" }
      })
      setFeedbackData((prev) => ({ ...prev, muscles: musclesFeedback }))
    }
  }, [currentWorkout])

  useEffect(() => {
    setFormShown(isWorkoutComplete)
  }, [isWorkoutComplete])

  // Handler to update feedback for a given muscle and field
  const handleMuscleFeedbackChange = (muscle, field, value) => {
    setFeedbackData((prev) => ({
      ...prev,
      muscles: {
        ...prev.muscles,
        [muscle]: {
          ...prev.muscles[muscle],
          [field]: value,
        },
      },
    }))
  }

  // Handler for overall fatigue rating
  const handleOverallFatigueChange = (value) => {
    setFeedbackData((prev) => ({
      ...prev,
      overallFatigue: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedbackData,
        workoutId: workout.id,
      }),
    })

    setFormShown(false)

    if (response.ok) {
      const data = await response.json()
      setProgram(data.program)
    }

    return response
  }

  // Render radio button inputs for a 1-5 scale for a given muscle and field.
  const renderRatingInputs = (muscle, field) => {
    const currentValue = feedbackData.muscles[muscle]?.[field] || ""
    const labels = {
      workload: "Workload",
      jointpain: "Joint Pain",
      soreness: "Soreness",
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{labels[field]}</label>
        <div className="flex space-x-2">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
            <label key={value} className="flex flex-col items-center">
              <input
                type="radio"
                name={`${muscle}-${field}`}
                value={value}
                checked={Number(currentValue) === value}
                onChange={(e) => handleMuscleFeedbackChange(muscle, field, Number(e.target.value))}
                className="sr-only"
              />
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer border ${
                  Number(currentValue) === value
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {value}
              </div>
              <span className="text-xs mt-1 text-gray-600">{value}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  // Render overall fatigue inputs using the same scale.
  const renderOverallFatigue = () => {
    const currentValue = feedbackData.overallFatigue || ""
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Fatigue</label>
        <div className="flex space-x-2 justify-center">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
            <label key={value} className="flex flex-col items-center">
              <input
                type="radio"
                name="overallFatigue"
                value={value}
                checked={Number(currentValue) === value}
                onChange={(e) => handleOverallFatigueChange(Number(e.target.value))}
                className="sr-only"
              />
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer border ${
                  Number(currentValue) === value
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {value}
              </div>
              <span className="text-xs mt-1 text-gray-600">{value}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 mb-4">
      {workout?.feedbackId ? (
        <div className="flex justify-center">
          <NextWorkout
            program={program}
            setCurrentWorkout={setCurrentWorkout}
            handleSubmit={handleSubmit}
            workout={workout}
          />
        </div>
      ) : isWorkoutComplete ? (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-green-800 mb-2">Workout Complete!</h3>
            <p className="text-green-700">
              Great job completing your workout! Please provide feedback to help optimize your future workouts.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <h3 className="font-medium text-gray-900">Workout Feedback</h3>
              {expanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            {expanded && (
              <div className="p-4">
                <form onSubmit={handleSubmit}>
                  {currentWorkout && currentWorkout.exercises && (
                    <>
                      {Array.from(new Set(currentWorkout.exercises.map((e) => e.muscle))).map((muscle) => (
                        <div key={muscle} className="mb-6 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">{muscle}</h4>
                          {renderRatingInputs(muscle, "workload")}
                          {renderRatingInputs(muscle, "jointpain")}
                          {renderRatingInputs(muscle, "soreness")}
                        </div>
                      ))}

                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">{renderOverallFatigue()}</div>

                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Submit Feedback & Continue
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
