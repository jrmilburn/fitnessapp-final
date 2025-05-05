"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, ChevronLeft, ChevronRight, Calendar, Dumbbell, X } from "lucide-react"
import ProgramDetails from "./program-details"

export default function ProgramBrowser({ programs, onDeleteProgram }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [isMobileView, setIsMobileView] = useState(false)
  const [showMobileList, setShowMobileList] = useState(true)
  const searchInputRef = useRef(null)
  const router = useRouter()

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    handleResize() // Set initial value
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Select first program by default if none selected
  useEffect(() => {
    if (programs.length > 0 && !selectedProgram) {
      setSelectedProgram(programs[0])
    }
  }, [programs, selectedProgram])

  // Filter programs based on search query
  const filteredPrograms = programs.filter((program) => program.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleProgramClick = (program) => {
    setSelectedProgram(program)
    if (isMobileView) {
      setShowMobileList(false)
    }
  }

  const handleCreateProgram = () => {
    router.push("/new")
  }

  const handleBackToList = () => {
    setShowMobileList(true)
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-112px)]">
      {/* Sidebar / Mobile List */}
      <div
        className={`
          bg-white border-r border-gray-200 
          ${isMobileView ? "w-full" : "w-80"} 
          ${isMobileView && !showMobileList ? "hidden" : "flex flex-col"}
        `}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">My Programs</h1>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search programs..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Program List */}
        <div className="flex-1 overflow-y-auto">
          {filteredPrograms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No programs found</div>
          ) : (
            <ul className="divide-y divide-gray-200 overflow-y-auto">
              {filteredPrograms.map((program) => (
                <li
                  key={program.id}
                  className={`
                    cursor-pointer hover:bg-gray-50 transition-colors
                    ${selectedProgram?.id === program.id ? "bg-blue-50 border-l-4 border-blue-500" : ""}
                  `}
                  onClick={() => handleProgramClick(program)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{program.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{program.length} weeks</span>
                          <span className="mx-2">•</span>
                          <Dumbbell className="h-4 w-4 mr-1" />
                          <span>{program.days} days/week</span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-gray-400 ${selectedProgram?.id === program.id ? "text-blue-500" : ""}`}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create New Program Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleCreateProgram}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Program</span>
          </button>
        </div>
      </div>

      {/* Program Details */}
      <div
        className={`
          flex-1 bg-gray-50 overflow-y-auto
          ${isMobileView && showMobileList ? "hidden" : "block"}
        `}
      >
        {selectedProgram ? (
          <>
            {isMobileView && (
              <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
                <button onClick={handleBackToList} className="flex items-center text-blue-600">
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  <span>Back to programs</span>
                </button>
              </div>
            )}
            <ProgramDetails program={selectedProgram} onDeleteProgram={onDeleteProgram} />
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-8">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Program Selected</h3>
              <p className="text-gray-500">Select a program from the list to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
