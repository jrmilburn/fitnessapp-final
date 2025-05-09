"use client"

import { useRouter } from "next/navigation"
import { Award, ArrowRight, BarChart2, Calendar, Dumbbell } from "lucide-react"
import { motion } from "framer-motion"

export default function ProgramComplete({ program }) {
  const router = useRouter()

  // Calculate program stats
  const totalWorkouts = program?.weeks?.reduce((total, week) => total + week.workouts.length, 0) || 0

  const totalExercises =
    program?.weeks?.reduce(
      (total, week) => total + week.workouts.reduce((wTotal, workout) => wTotal + workout.exercises.length, 0),
      0,
    ) || 0

  const totalSets =
    program?.weeks?.reduce(
      (total, week) =>
        total +
        week.workouts.reduce(
          (wTotal, workout) =>
            wTotal + workout.exercises.reduce((eTotal, exercise) => eTotal + exercise.sets.length, 0),
          0,
        ),
      0,
    ) || 0

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center flex-1 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden w-full"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Award className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Program Complete!</h1>
              <p className="text-blue-100">Congratulations on completing your workout program</p>
            </motion.div>
          </div>

          {/* Program stats */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Program Summary</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-800">{program?.weeks?.length || 0}</div>
                <div className="text-sm text-gray-600">Weeks</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Dumbbell className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-800">{totalWorkouts}</div>
                <div className="text-sm text-gray-600">Workouts</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <BarChart2 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-800">{totalSets}</div>
                <div className="text-sm text-gray-600">Sets</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-600">
                You've completed <span className="font-semibold">{program?.name}</span> with {totalExercises} exercises
                across {totalWorkouts} workouts.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => router.push("/new")}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Create New Program
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <button
                onClick={() => router.push("/analytics")}
                className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                View Analytics
                <BarChart2 className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
