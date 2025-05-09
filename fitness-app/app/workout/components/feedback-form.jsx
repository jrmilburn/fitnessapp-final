"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ChevronLeft, ChevronRight, X, Activity } from "lucide-react"
import { toast } from "react-hot-toast"
import WorkoutCompleteModal from "./workout-complete-modal"

export default function FeedbackForm({ program, setCurrentWorkout, workout, setProgram }) {
  // Find the current workout from the program data
  const currentWorkout = program?.weeks?.flatMap((week) => week.workouts).find((w) => w.id === workout?.id)

  // Determine if all exercises in the workout are complete
  const isWorkoutComplete = currentWorkout?.exercises?.every((exercise) => exercise?.sets.every((set) => set.complete))

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [workoutCompleteModalOpen, setWorkoutCompleteModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // Reset form state when workout changes
  useEffect(() => {
    if (workout?.id) {
      setCurrentStep(0)
    }
  }, [workout?.id])

  const [uniqueMuscles, setUniqueMuscles] = useState([])

  // This state holds the feedback data:
  // muscles: an object keyed by muscle name with ratings for workload, jointpain, and soreness
  // overallFatigue: a single rating value (1-5)
  const [feedbackData, setFeedbackData] = useState({
    muscles: {},
    overallFatigue: "",
  })

  // When the currentWorkout is available, initialize feedback entries for each unique muscle.
  useEffect(() => {
    if (currentWorkout && currentWorkout.exercises) {
      const muscles = Array.from(new Set(currentWorkout.exercises.map((e) => e.muscle)))
      setUniqueMuscles(muscles)

      const musclesFeedback = {}
      muscles.forEach((muscle) => {
        musclesFeedback[muscle] = { workload: "", jointpain: "", soreness: "" }
      })
      setFeedbackData((prev) => ({ ...prev, muscles: musclesFeedback }))
    }
  }, [currentWorkout])

  // Show workout complete confirmation when workout is complete and no feedback has been submitted yet
  useEffect(() => {
    if (isWorkoutComplete && !workout?.feedbackId && !feedbackModalOpen && !workoutCompleteModalOpen) {
      setWorkoutCompleteModalOpen(true)
    }
  }, [isWorkoutComplete, workout?.feedbackId, feedbackModalOpen, workoutCompleteModalOpen])

  // Handle rating selection for a muscle and field
  const handleRatingSelect = (muscle, field, value) => {
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

  // Handle overall fatigue rating
  const handleOverallFatigueSelect = (value) => {
    setFeedbackData((prev) => ({
      ...prev,
      overallFatigue: value,
    }))
  }

  // Navigate to next step
  const nextStep = () => {
    // Validate current step
    if (currentStep === 0) {
      // Check if all workload ratings are provided
      const allWorkloadsProvided = uniqueMuscles.every((muscle) => feedbackData.muscles[muscle]?.workload !== "")
      if (!allWorkloadsProvided) {
        toast.error("Please rate the workload for all muscle groups")
        return
      }
    } else if (currentStep === 1) {
      // Check if all joint pain ratings are provided
      const allJointPainProvided = uniqueMuscles.every((muscle) => feedbackData.muscles[muscle]?.jointpain !== "")
      if (!allJointPainProvided) {
        toast.error("Please rate the joint pain for all muscle groups")
        return
      }
    } else if (currentStep === 2) {
      // Check if all soreness ratings are provided
      const allSorenessProvided = uniqueMuscles.every((muscle) => feedbackData.muscles[muscle]?.soreness !== "")
      if (!allSorenessProvided) {
        toast.error("Please rate the soreness for all muscle groups")
        return
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Reset form state
  const resetForm = () => {
    setCurrentStep(0)
  }

  // Submit feedback
  const handleSubmit = async () => {
    // Validate overall fatigue
    if (feedbackData.overallFatigue === "") {
      toast.error("Please rate your overall fatigue")
      return
    }

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackData,
          workoutId: workout.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      const data = await response.json()
      setProgram(data.program)
      setFeedbackModalOpen(false)
      resetForm() // Reset form after submission
      toast.success("Feedback submitted successfully!")

      // Find the next workout with incomplete sets
      const nextWorkoutWithIncompleteSet = data.program.weeks
        .flatMap((week) => week.workouts)
        .find((w) => w.exercises.some((exercise) => exercise.sets.some((set) => !set.complete)))

      if (nextWorkoutWithIncompleteSet) {
        setCurrentWorkout(nextWorkoutWithIncompleteSet)
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("Failed to submit feedback")
    }
  }

  // Handle workout completion confirmation
  const handleWorkoutCompleteConfirm = () => {
    setWorkoutCompleteModalOpen(false)
    setFeedbackModalOpen(true)
    resetForm()
  }

  // Render rating options (1-5 scale)
  const renderRatingOptions = (muscle, field, currentValue) => {
    const labels = {
      1: "Very Low",
      2: "Low",
      3: "Moderate",
      4: "High",
      5: "Very High",
    }

    const icons = {
      workload: <Activity className="h-5 w-5" />,
      jointpain: <Activity className="h-5 w-5" />,
      soreness: <Activity className="h-5 w-5" />,
    }

    return (
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex items-center mb-1">
          {icons[field]}
          <span className="ml-2 font-medium">{muscle}</span>
        </div>
        <div className="flex justify-between w-full">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRatingSelect(muscle, field, value)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                Number(currentValue) === value
                  ? "bg-blue-100 border-blue-500 border-2 text-blue-700"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
              }`}
              style={{ width: "18%" }}
            >
              <span className="text-lg font-bold">{value}</span>
              <span className="text-xs text-center mt-1">{labels[value]}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // If workout has feedback already, don't show anything
  if (workout?.feedbackId) {
    return null
  }

  // If workout is complete but user hasn't submitted feedback yet, show the "Complete Workout" button
  if (!feedbackModalOpen && !workoutCompleteModalOpen && isWorkoutComplete) {
    return (
      <div className="mt-8 mb-4 flex justify-center">
        <button
          onClick={() => setWorkoutCompleteModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Complete Workout & Continue
        </button>
      </div>
    )
  }

  // Step titles and descriptions
  const steps = [
    {
      title: "Muscle Workload",
      description: "How intense was the workout for each muscle group?",
      field: "workload",
      icon: <Activity className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Joint Pain",
      description: "Rate any joint pain you experienced during the workout",
      field: "jointpain",
      icon: <Activity className="h-6 w-6 text-yellow-600" />,
    },
    {
      title: "Muscle Soreness",
      description: "How sore are your muscles after the workout?",
      field: "soreness",
      icon: <Activity className="h-6 w-6 text-red-600" />,
    },
    {
      title: "Overall Fatigue",
      description: "Rate your overall fatigue level after this workout",
      field: "overallFatigue",
      icon: <Activity className="h-6 w-6 text-purple-600" />,
    },
  ]

  return (
    <>
      {/* Workout Complete Confirmation Modal */}
      <WorkoutCompleteModal
        isOpen={workoutCompleteModalOpen}
        onClose={() => setWorkoutCompleteModalOpen(false)}
        onConfirm={handleWorkoutCompleteConfirm}
        workout={workout}
      />

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Workout Feedback</h2>
                <button
                  onClick={() => {
                    setFeedbackModalOpen(false)
                    resetForm()
                  }}
                  className="p-1 rounded-full hover:bg-blue-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress indicator */}
              <div className="px-4 pt-4">
                <div className="flex justify-between mb-2">
                  {steps.map((step, index) => (
                    <div key={index} className={`w-1/4 px-1 ${index < steps.length - 1 ? "relative" : ""}`}>
                      <div className={`h-2 rounded-full ${index <= currentStep ? "bg-blue-600" : "bg-gray-200"}`}></div>
                      {index < steps.length - 1 && (
                        <div className="absolute top-1 right-0 w-2 h-2 -mr-1 rounded-full bg-white border-2 border-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 flex justify-between px-1">
                  <span>Start</span>
                  <span>Finish</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center mb-4">
                  {steps[currentStep].icon}
                  <div className="ml-3">
                    <h3 className="font-bold text-lg">{steps[currentStep].title}</h3>
                    <p className="text-gray-600 text-sm">{steps[currentStep].description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {currentStep < 3 ? (
                    // Muscle-specific ratings (steps 0-2)
                    uniqueMuscles.map((muscle) => (
                      <div key={muscle} className="bg-gray-50 p-3 rounded-lg">
                        {renderRatingOptions(
                          muscle,
                          steps[currentStep].field,
                          feedbackData.muscles[muscle]?.[steps[currentStep].field] || "",
                        )}
                      </div>
                    ))
                  ) : (
                    // Overall fatigue (step 3)
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="text-center mb-2">
                          <span className="text-lg font-medium">Rate your overall fatigue</span>
                          <p className="text-sm text-gray-600">How tired do you feel after this workout?</p>
                        </div>
                        <div className="flex justify-between w-full max-w-md">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleOverallFatigueSelect(value)}
                              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                                Number(feedbackData.overallFatigue) === value
                                  ? "bg-blue-100 border-blue-500 border-2 text-blue-700"
                                  : "bg-white border border-gray-200 hover:bg-gray-50"
                              }`}
                              style={{ width: "18%" }}
                            >
                              <span className="text-xl font-bold">{value}</span>
                              <span className="text-xs text-center mt-1">
                                {value === 1
                                  ? "Fresh"
                                  : value === 2
                                    ? "Slightly Tired"
                                    : value === 3
                                      ? "Moderately Tired"
                                      : value === 4
                                        ? "Very Tired"
                                        : "Exhausted"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    currentStep === 0
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    Submit
                    <CheckCircle className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
