"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, Search, ChevronDown } from "lucide-react"

// Custom hook for debounced values
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Custom Select Component
function CustomSelect({ value, onValueChange, options, placeholder, className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <span className="block truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
          <div className="max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onValueChange(option.value)
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Skeleton loader component
function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
      <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded ml-4"></div>
    </div>
  )
}

// Empty state component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No exercises found</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
      <button className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
        Add new exercise template
      </button>
    </div>
  )
}

export default function ExerciseModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
  showUpdateAllOption = false,
  updateAll = false,
  onUpdateAllChange = () => {},
}) {
  const [exerciseTemplates, setExerciseTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [muscleGroups, setMuscleGroups] = useState([])
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const modalRef = useRef()
  const firstFocusableRef = useRef()

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen, isMobile])

  // Focus management
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus()
    }
  }, [isOpen])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      fetchData()
      setIsClosing(false)
    } else {
      setSelectedTemplate(null)
      setSelectedMuscleGroup("all")
      setSearchTerm("")
      setExerciseTemplates([])
      setFilteredTemplates([])
    }
  }, [isOpen])

  // Filter templates when search term or muscle group changes
  useEffect(() => {
    filterTemplates()
  }, [debouncedSearchTerm, selectedMuscleGroup, exerciseTemplates])

  // Remember last used muscle group
  useEffect(() => {
    const savedMuscleGroup = localStorage.getItem("lastSelectedMuscleGroup")
    if (savedMuscleGroup && muscleGroups.length > 0) {
      setSelectedMuscleGroup(savedMuscleGroup)
    }
  }, [muscleGroups])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [muscleGroupsResponse, templatesResponse] = await Promise.all([
        fetch("/api/muscle-groups"),
        fetch("/api/exercise-templates"),
      ])

      if (muscleGroupsResponse.ok) {
        const muscleGroupsData = await muscleGroupsResponse.json()
        setMuscleGroups(muscleGroupsData)
      }

      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json()
        const allTemplates = [...templatesData.defaultExercises, ...templatesData.userExercises]
        setExerciseTemplates(allTemplates)
        setFilteredTemplates(allTemplates)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTemplates = useCallback(() => {
    if (exerciseTemplates.length === 0) return

    let filtered = [...exerciseTemplates]

    if (selectedMuscleGroup !== "all") {
      filtered = filtered.filter((template) => template.muscleGroup.id === selectedMuscleGroup)
    }

    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(term) || template.shortDescription?.toLowerCase().includes(term),
      )
    }

    setFilteredTemplates(filtered)
  }, [exerciseTemplates, selectedMuscleGroup, debouncedSearchTerm])

  const handleConfirm = () => {
    if (!selectedTemplate) return
    onConfirm(selectedTemplate, updateAll)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSelectedTemplate(null)
      setSelectedMuscleGroup("all")
      setSearchTerm("")
      onClose()
    }, 300)
  }

  const handleMuscleGroupChange = (value) => {
    setSelectedMuscleGroup(value)
    localStorage.setItem("lastSelectedMuscleGroup", value)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        handleClose()
      } else if (e.key === "Enter" && selectedTemplate) {
        handleConfirm()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedTemplate])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener("keydown", handleTabKey)
    return () => document.removeEventListener("keydown", handleTabKey)
  }, [isOpen])

  if (!isOpen) return null

  const muscleGroupOptions = [
    { value: "all", label: "All Muscle Groups" },
    ...muscleGroups.map((group) => ({ value: group.id, label: group.name })),
  ]

  const modalContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900" ref={modalRef}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{title}</h2>
            {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
          </div>
          <button
            ref={firstFocusableRef}
            onClick={handleClose}
            className="flex-shrink-0 ml-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 md:flex-[2] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="md:flex-1">
            <CustomSelect
              value={selectedMuscleGroup}
              onValueChange={handleMuscleGroupChange}
              options={muscleGroupOptions}
              placeholder="All Muscle Groups"
            />
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full md:h-64 overflow-y-auto" role="region" aria-live="polite" aria-label="Exercise list">
          {isLoading ? (
            <div>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedTemplate?.id === template.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{template.name}</div>
                    {template.shortDescription && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {template.shortDescription}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-2 min-w-0 flex-shrink-0">
                    {template.muscleGroup.name}
                  </div>
                  <button
                    className={`ml-2 flex-shrink-0 px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      selectedTemplate?.id === template.id
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTemplate(template)
                    }}
                  >
                    {selectedTemplate?.id === template.id ? "Selected" : "Select"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Update All Option */}
      {showUpdateAllOption && (
        <div className="px-4 md:px-6 pb-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={updateAll}
                onChange={(e) => onUpdateAllChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Update all upcoming exercises</span>
            </label>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTemplate}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selectedTemplate
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  )

  // Mobile bottom sheet
  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={handleClose} />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-lg transition-transform duration-300 h-[100vh] ${
            isOpen && !isClosing ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
          {modalContent}
        </div>
      </div>
    )
  }

  // Desktop dialog
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={handleClose} />
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-hidden transition-all duration-300 ${
          isOpen && !isClosing ? "scale-100" : "scale-95"
        }`}
      >
        {modalContent}
      </div>
    </div>
  )
}
