"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FeedbackSummary({ workout }) {
  const [isExpanded, setIsExpanded] = useState(false)

    console.log(workout);

  if (!workout?.feedbackId) {
    return null
  }

  // Get all unique muscles from the workout
  const uniqueMuscles = Array.from(new Set(workout.exercises.map((e) => e.muscle)))

  // Find feedback for each muscle
  const muscleFeedback = workout.MuscleFeedback || []

  // Get overall fatigue - assuming the first feedback entry has the overall fatigue
  // This would need to be adjusted based on your actual data structure
  const overallFatigue = muscleFeedback.length > 0 ? muscleFeedback[0].overallFatigue : null

  const getRatingLabel = (value) => {
    const ratings = ["Very Low", "Low", "Moderate", "High", "Very High"]
    return ratings[value - 1] || value
  }

  const getFatigueLabel = (value) => {
    const ratings = ["Fresh", "Slightly Tired", "Moderately Tired", "Very Tired", "Exhausted"]
    return ratings[value - 1] || value
  }

  return (
    <div className="mt-6 mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div
        className="p-4 bg-blue-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium text-blue-800">Workout Feedback Summary</h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-blue-600" />
        )}
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Overall Fatigue</h4>
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-purple-100 text-purple-800 font-medium border border-purple-200">
                {overallFatigue || "-"}
              </div>
              <span className="ml-3 text-gray-600">
                {overallFatigue ? getFatigueLabel(overallFatigue) : "Not rated"}
              </span>
            </div>
          </div>

          <h4 className="text-sm font-medium text-gray-700 mb-2">Muscle Group Feedback</h4>

          <div className="space-y-4">
            {uniqueMuscles.map((muscle) => {
              const feedback = muscleFeedback.find((f) => f.muscle === muscle)

              if (!feedback)
                return (
                  <div key={muscle} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700">{muscle}</p>
                    <p className="text-sm text-gray-500">No feedback provided</p>
                  </div>
                )

              return (
                <div key={muscle} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700 mb-2">{muscle}</p>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Workload</div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-100 text-blue-800 font-medium border border-blue-200">
                          {feedback.workload}
                        </div>
                        <span className="ml-2 text-xs text-gray-600">{getRatingLabel(feedback.workload)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Joint Pain</div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-yellow-100 text-yellow-800 font-medium border border-yellow-200">
                          {feedback.jointpain}
                        </div>
                        <span className="ml-2 text-xs text-gray-600">{getRatingLabel(feedback.jointpain)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">Soreness</div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-red-100 text-red-800 font-medium border border-red-200">
                          {feedback.soreness}
                        </div>
                        <span className="ml-2 text-xs text-gray-600">{getRatingLabel(feedback.soreness)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
