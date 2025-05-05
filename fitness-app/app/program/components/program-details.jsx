"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  Dumbbell,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Share2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function ProgramDetails({ program, onDeleteProgram }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedWeek, setExpandedWeek] = useState(1)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const router = useRouter()

  if (!program) {
    return null
  }

  const handleEditProgram = () => {
    router.push(`/program/${program.id}`)
    setMenuOpen(false)
  }

  const handleDeleteClick = () => {
    setConfirmDelete(true)
    setMenuOpen(false)
  }

  const handleConfirmDelete = () => {
    onDeleteProgram(program.id)
    setConfirmDelete(false)
  }

  const handleCancelDelete = () => {
    setConfirmDelete(false)
  }

  const handleDuplicateProgram = () => {
    // Implement duplicate functionality
    alert("Duplicate functionality to be implemented")
    setMenuOpen(false)
  }

  const handleShareProgram = () => {
    // Implement share functionality
    alert("Share functionality to be implemented")
    setMenuOpen(false)
  }

  const toggleWeek = (weekNo) => {
    setExpandedWeek(expandedWeek === weekNo ? null : weekNo)
  }

  return (
    <div className=" px-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{program.name}</h1>
            {program.comments && <p className="mt-2 text-gray-600">{program.comments}</p>}
          </div>

          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleEditProgram}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Program
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleDuplicateProgram}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleShareProgram}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Program Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Duration</span>
            </div>
            <p className="text-lg font-medium">{program.length} weeks</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <Dumbbell className="h-4 w-4 mr-2" />
              <span className="text-sm">Frequency</span>
            </div>
            <p className="text-lg font-medium">{program.days} days/week</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">Status</span>
            </div>
            <p className="text-lg font-medium">{program.active ? "Active" : "Completed"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-500 mb-1">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">Created</span>
            </div>
            <p className="text-lg font-medium">{new Date(program.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Program Structure */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Program Structure</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {program.weeks &&
            program.weeks.map((week) => (
              <div key={week.weekNo} className="border-b border-gray-200 last:border-b-0">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleWeek(week.weekNo)}
                >
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Week {week.weekNo}</span>
                    <span className="ml-2 text-sm text-gray-500">({week.workouts.length} workouts)</span>
                  </div>
                  {expandedWeek === week.weekNo ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>

                {expandedWeek === week.weekNo && (
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {week.workouts.map((workout) => {
                        const isWorkoutComplete = workout.exercises.every((exercise) =>
                          exercise.sets.every((set) => set.complete),
                        )

                        return (
                          <div key={workout.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                              <h3 className="font-medium">{workout.name}</h3>
                              {workout.programmed &&
                                (isWorkoutComplete ? (
                                  <div className="flex items-center text-green-600">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Completed</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-blue-600">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    <span className="text-xs">In Progress</span>
                                  </div>
                                ))}
                            </div>

                            <div className="p-4">
                              {workout.exercises.length > 0 ? (
                                <ul className="space-y-2">
                                  {workout.exercises.map((exercise, idx) => (
                                    <li key={exercise.id || idx} className="text-sm">
                                      <div className="font-medium">{exercise.name}</div>
                                      <div className="text-gray-500 text-xs">
                                        {exercise.sets?.length || 0} sets • {exercise.muscle}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500 italic">No exercises added</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Delete Program</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{program.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
