"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Workout from "./components/workout"
import WorkoutHeader from "./components/workout-header"
import { Dumbbell } from "lucide-react"

export default function WorkoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [program, setProgram] = useState(null)
  const [currentWorkout, setCurrentWorkout] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/program")
      .then((response) => response.json())
      .then((data) => {
        // If there's no program (or weeks) then redirect to "/new"
        if (!data || !data.weeks || data.weeks.length === 0) {
          router.push("/new")
          return
        }

        const nextWorkoutWithIncompleteSet = data.weeks
          .flatMap((week) => week.workouts)
          .find((workout) => workout.exercises.some((exercise) => exercise.sets.some((set) => !set.complete)))

        setProgram(data)
        setCurrentWorkout(nextWorkoutWithIncompleteSet)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching program:", error)
        router.push("/new")
      })
  }, [router])

  useEffect(() => {
    if (program) {
      let updatedWorkout = null

      // If there's already a current workout, try to find its updated version in the program.
      if (currentWorkout) {
        updatedWorkout = program.weeks
          .flatMap((week) => week.workouts)
          .find((workout) => workout.id === currentWorkout.id)
      }

      // If not found, compute the next workout with an incomplete set.
      if (!updatedWorkout) {
        updatedWorkout = program.weeks
          .flatMap((week) => week.workouts)
          .find((workout) => workout.exercises.some((exercise) => exercise.sets.some((set) => !set.complete)))
      }

      setCurrentWorkout(updatedWorkout)
    }
  }, [program, currentWorkout])

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <Dumbbell className="h-16 w-16 text-blue-600 mb-4" />
          <p className="text-lg text-gray-600">Loading your workout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        {program && (
          <WorkoutHeader
            program={program}
            setProgram={setProgram}
            currentWorkout={currentWorkout}
            setCurrentWorkout={setCurrentWorkout}
            viewonly={false}
          />
        )}

        <div className="flex-1 p-4">
          <Workout
            workout={currentWorkout}
            setProgram={setProgram}
            program={program}
            setCurrentWorkout={setCurrentWorkout}
            viewonly={false}
          />
        </div>
      </div>
    </div>
  )
}
