"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

export default function ExerciseLibrary({ defaultExercises = [], userExercises = [], onTemplateCreate = null }) {
  // Tab state
  const [selectedTab, setSelectedTab] = useState(0)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedMuscle, setSelectedMuscle] = useState("All")

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef(null)

  // Form state
  const [formState, setFormState] = useState({
    name: "",
    muscleGroupId: "",
    description: "",
    shortDescription: "",
    videoUrl: "",
    isPublic: false,
  })
  const [formErrors, setFormErrors] = useState({})

  // Local state for exercises (to update after creation)
  const [localDefaultExercises, setLocalDefaultExercises] = useState(defaultExercises)
  const [localUserExercises, setLocalUserExercises] = useState(userExercises)

  // Toast notifications
  const [toasts, setToasts] = useState([])

  // Add state for muscle groups:
  const [muscleGroups, setMuscleGroups] = useState([])

  // Add useEffect to fetch muscle groups:
  useEffect(() => {
    // Fetch muscle groups when component mounts
    fetch("/api/muscle-groups")
      .then((response) => response.json())
      .then((data) => {
        setMuscleGroups(data)
      })
      .catch((error) => {
        console.error("Error fetching muscle groups:", error)
      })
  }, [])

  // Get unique muscles from the active tab's exercises
  const getUniqueMuscles = useCallback(() => {
    const exercises = selectedTab === 0 ? localDefaultExercises : localUserExercises
    const muscles = [...new Set(exercises.map((exercise) => exercise.muscleGroup.name))].sort()
    return muscles
  }, [selectedTab, localDefaultExercises, localUserExercises])

  // Unique muscles for the dropdown
  const [uniqueMuscles, setUniqueMuscles] = useState(getUniqueMuscles())

  // Update unique muscles when tab changes
  useEffect(() => {
    setUniqueMuscles(getUniqueMuscles())
    setSelectedMuscle("All") // Reset muscle filter when changing tabs
  }, [selectedTab, getUniqueMuscles])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle click outside modal to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleModalClose()
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isModalOpen])

  // Handle escape key to close modal
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        handleModalClose()
      }
    }

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isModalOpen])

  // Filter exercises based on search query and selected muscle
  const getFilteredExercises = useCallback(() => {
    const exercises = selectedTab === 0 ? localDefaultExercises : localUserExercises

    return exercises.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      const matchesMuscle = selectedMuscle === "All" || exercise.muscleGroup.name === selectedMuscle
      return matchesSearch && matchesMuscle
    })
  }, [selectedTab, localDefaultExercises, localUserExercises, debouncedQuery, selectedMuscle])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    if (!formState.name || formState.name.length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!formState.muscleGroupId) {
      errors.muscleGroupId = "Please select a muscle group"
    }

    if (!formState.shortDescription || formState.shortDescription.length < 5) {
      errors.shortDescription = "Short description must be at least 5 characters"
    }

    if (formState.videoUrl && !isValidUrl(formState.videoUrl)) {
      errors.videoUrl = "Please enter a valid URL"
    }

    // Check for duplicate name in user exercises
    const isDuplicate = localUserExercises.some(
      (exercise) => exercise.name.toLowerCase() === formState.name.toLowerCase(),
    )

    if (isDuplicate) {
      errors.name = "An exercise with this name already exists in your exercises"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validate URL
  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // Create new exercise template
      const newExercise = {
        id: `temp-${Date.now()}`, // Temporary ID until server assigns one
        name: formState.name,
        muscleGroupId: formState.muscleGroupId,
        description: formState.description || null,
        shortDescription: formState.shortDescription || null,
        videoUrl: formState.videoUrl || null,
        isPublic: formState.isPublic,
      }

      // POST to API
      const response = await fetch("/api/exercise-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExercise),
      })

      if (!response.ok) {
        throw new Error("Failed to create exercise template")
      }

      const createdTemplate = await response.json()

      // Update local state based on whether it's public or not
      if (formState.isPublic) {
        setLocalDefaultExercises((prev) => [...prev, createdTemplate])
      } else {
        setLocalUserExercises((prev) => [...prev, createdTemplate])
      }

      // Call the callback if provided
      if (onTemplateCreate) {
        onTemplateCreate(createdTemplate)
      }

      // Show success toast
      addToast({
        type: "success",
        message: "Exercise created successfully",
      })

      // Close modal and reset form
      setIsModalOpen(false)
      setFormState({
        name: "",
        muscleGroupId: "",
        description: "",
        shortDescription: "",
        videoUrl: "",
        isPublic: false,
      })
    } catch (error) {
      console.error("Error creating exercise template:", error)

      // Show error toast
      addToast({
        type: "error",
        message: "Failed to create exercise",
      })
    }
  }

  // Add toast notification
  const addToast = (toast) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  // Reset form when modal closes
  const handleModalClose = () => {
    setIsModalOpen(false)
    setFormState({
      name: "",
      muscleGroupId: "",
      description: "",
      shortDescription: "",
      videoUrl: "",
      isPublic: false,
    })
    setFormErrors({})
  }

  // Get filtered exercises
  const filteredExercises = getFilteredExercises()

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header with search, filter, and create button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Muscle filter dropdown */}
          <div className="w-full sm:w-auto">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm"
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
            >
              <option value="All">All Muscle Groups</option>
              {uniqueMuscles.map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Create button */}
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Exercise
        </button>
      </div>

      {/* Custom Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          <button
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors ${
              selectedTab === 0
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow"
                : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setSelectedTab(0)}
          >
            Library
          </button>
          <button
            className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors ${
              selectedTab === 1
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow"
                : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setSelectedTab(1)}
          >
            My Exercises
          </button>
        </div>

        {/* Tab Panels */}
        <div className="mt-6">
          {/* Library Tab Panel */}
          {selectedTab === 0 && (
            <div>
              {filteredExercises.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredExercises.map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message={
                    debouncedQuery || selectedMuscle !== "All"
                      ? "No exercises match your search"
                      : "No exercises in the library"
                  }
                />
              )}
            </div>
          )}

          {/* My Exercises Tab Panel */}
          {selectedTab === 1 && (
            <div>
              {filteredExercises.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredExercises.map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message={
                    debouncedQuery || selectedMuscle !== "All"
                      ? "No exercises match your search"
                      : "You haven't created any exercises yet"
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Exercise Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] overflow-y-auto">
            <div className="min-h-screen px-4 text-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 dark:bg-opacity-50 z-10"
                onClick={handleModalClose}
              />

              {/* This element is to trick the browser into centering the modal contents. */}
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>

              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all z-20 relative"
              >
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Create New Exercise</h3>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Name input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                      placeholder="e.g., Bench Press"
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                  </div>

                  {/* Muscle group select */}
                  <div>
                    <label
                      htmlFor="muscleGroupId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Muscle Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="muscleGroupId"
                      id="muscleGroupId"
                      value={formState.muscleGroupId}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.muscleGroupId ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                    >
                      <option value="">Select a muscle group</option>
                      {muscleGroups.map((muscleGroup) => (
                        <option key={muscleGroup.id} value={muscleGroup.id}>
                          {muscleGroup.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.muscleGroupId && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.muscleGroupId}</p>
                    )}
                  </div>

                  {/* Short Description input */}
                  <div>
                    <label
                      htmlFor="shortDescription"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      id="shortDescription"
                      value={formState.shortDescription}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.shortDescription ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                      placeholder="Brief description (shown on cards)"
                    />
                    {formErrors.shortDescription && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.shortDescription}</p>
                    )}
                  </div>

                  {/* Video URL input */}
                  <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Video URL (optional)
                    </label>
                    <input
                      type="text"
                      name="videoUrl"
                      id="videoUrl"
                      value={formState.videoUrl}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        formErrors.videoUrl ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                      placeholder="e.g., https://youtube.com/watch?v=..."
                    />
                    {formErrors.videoUrl && <p className="mt-1 text-sm text-red-500">{formErrors.videoUrl}</p>}
                  </div>

                  {/* Full Description textarea */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Description (optional)
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={4}
                      value={formState.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Detailed instructions, form cues, etc."
                    />
                  </div>

                  {/* Public checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublic"
                      id="isPublic"
                      checked={formState.isPublic}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-700 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Make this exercise public (available in the library)
                    </label>
                  </div>

                  {/* Form actions */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      onClick={handleModalClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed bottom-0 right-0 p-6 z-50">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`mb-2 p-4 rounded-md shadow-lg flex items-center ${
                toast.type === "success"
                  ? "bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100"
                  : "bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-3" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-3" />
              )}
              <p>{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Exercise Card Component
function ExerciseCard({ exercise }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setShowDetails(true)}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col"
      >
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{exercise.name}</h3>
            {/*exercise.shortDescription && (
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{exercise.shortDescription}</p>
            )*/}
          </div>
          <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
              {exercise.muscleGroup.name}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Exercise Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-[10001]">
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 dark:bg-opacity-50 z-10"
              onClick={() => setShowDetails(false)}
            />

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="inline-block w-full max-w-3xl p-6 my-8 overflow-y-auto max-h-[calc(100vh-120px)] text-left align-middle bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all z-20 relative"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{exercise.name}</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                  {exercise.muscleGroup.name}
                </span>
              </div>

              {/* Short Description */}
              {exercise.shortDescription && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><strong>Summary</strong></h4>
                  <p className="text-gray-600 dark:text-gray-400">{exercise.shortDescription}</p>
                </div>
              )}

              {/* Video Embed */}
              {exercise.videoUrl && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><strong>Educational Video</strong></h4>
                  <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
                    <VideoEmbed url={exercise.videoUrl} className="absolute top-0 left-0 w-full h-full object-cover" />
                  </div>
                </div>
              )}

                            {/* External Video Link (if embedding fails) */}
              {exercise.videoUrl && (
                <div className="mt-4">
                  <a
                    href={exercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open video in new tab
                  </a>
                </div>
              )}

              {/* Full Description */}
              {exercise.description ? (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><strong>Full Description</strong></h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{exercise.description}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-gray-500 dark:text-gray-400 italic">No detailed description available.</div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  )
}

// Video Embed Component
function VideoEmbed({ url }) {
  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url) => {
    try {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
      )?.[1]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    } catch (error) {
      return null
    }
  }

  // Extract video ID from Vimeo URL
  const getVimeoEmbedUrl = (url) => {
    try {
      const videoId = url.match(/vimeo\.com\/(?:.*\/)?([0-9]+)/)?.[1]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null
    } catch (error) {
      return null
    }
  }

  // Determine the embed URL based on the video platform
  const getEmbedUrl = (url) => {
    const youtubeEmbed = getYouTubeEmbedUrl(url)
    if (youtubeEmbed) return youtubeEmbed

    const vimeoEmbed = getVimeoEmbedUrl(url)
    if (vimeoEmbed) return vimeoEmbed

    return null
  }

  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="text-center p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Unable to embed video.{" "}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Open video in new tab
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <iframe
      src={embedUrl}
      title="Video"
      className="w-full h-full"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  )
}

// Empty State Component
function EmptyState({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
        <Dumbbell className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No exercises found</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">{message}</p>
    </motion.div>
  )
}

// Dumbbell icon for the empty state
function Dumbbell(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 6.5h11"></path>
      <path d="M6.5 17.5h11"></path>
      <path d="M4 4v16"></path>
      <path d="M9 4v16"></path>
      <path d="M15 4v16"></path>
      <path d="M20 4v16"></path>
    </svg>
  )
}
