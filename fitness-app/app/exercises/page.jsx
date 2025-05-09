"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import ExerciseLibrary from "../../components/exercise/ExerciseLibrary"
import { Dumbbell } from "lucide-react"

export default function ExercisesPage() {
  const { data: session, status } = useSession()
  const [defaultExercises, setDefaultExercises] = useState([])
  const [userExercises, setUserExercises] = useState([])
  const [muscleGroups, setMuscleGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      Promise.all([fetchExerciseTemplates(), fetchMuscleGroups()])
    }
  }, [status])

  const fetchExerciseTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/exercise-templates")

      if (!response.ok) {
        throw new Error("Failed to fetch exercise templates")
      }

      const data = await response.json()
      setDefaultExercises(data.defaultExercises || [])
      setUserExercises(data.userExercises || [])
    } catch (error) {
      console.error("Error fetching exercise templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMuscleGroups = async () => {
    try {
      const response = await fetch("/api/muscle-groups")

      if (!response.ok) {
        throw new Error("Failed to fetch muscle groups")
      }

      const data = await response.json()
      setMuscleGroups(data || [])
    } catch (error) {
      console.error("Error fetching muscle groups:", error)
    }
  }

  const handleTemplateCreate = (template) => {
    // Update the appropriate list based on whether the template is public or not
    if (template.isPublic) {
      setDefaultExercises((prev) => [...prev, template])
    } else {
      setUserExercises((prev) => [...prev, template])
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Dumbbell className="h-12 w-12 text-blue-600 animate-pulse mb-4" />
          <p className="text-gray-600">Loading exercise library...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-lg text-gray-600 mb-4">Please sign in to access the exercise library</p>
          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Exercise Library</h1>

        <ExerciseLibrary
          defaultExercises={defaultExercises}
          userExercises={userExercises}
          muscleGroups={muscleGroups}
          onTemplateCreate={handleTemplateCreate}
        />
      </div>
    </div>
  )
}
