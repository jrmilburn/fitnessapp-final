"use client"
import { useState } from "react"
import { HelpCircle } from "lucide-react"

export default function ProgramStructure({ programStructure, setProgramStructure, autoRegulated, setAutoRegulated }) {
  const handleChange = (field, value) => {
    setProgramStructure((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="program-name" className="block text-sm font-medium text-gray-700 mb-1">
            Program Name
          </label>
          <input
            id="program-name"
            value={programStructure.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="My Workout Program"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="program-comments" className="block text-sm font-medium text-gray-700 mb-1">
            Comments (Optional)
          </label>
          <textarea
            id="program-comments"
            value={programStructure.comments || ""}
            onChange={(e) => handleChange("comments", e.target.value)}
            placeholder="Any notes about this program..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="program-days" className="block text-sm font-medium text-gray-700 mb-1">
            Weekly Frequency
          </label>
          <select
            id="program-days"
            value={programStructure.days}
            onChange={(e) => handleChange("days", Number.parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1 day / week</option>
            <option value={2}>2 days / week</option>
            <option value={3}>3 days / week</option>
            <option value={4}>4 days / week</option>
            <option value={5}>5 days / week</option>
            <option value={6}>6 days / week</option>
          </select>
        </div>

        <div>
          <label htmlFor="program-length" className="block text-sm font-medium text-gray-700 mb-1">
            Program Length
          </label>
          <select
            id="program-length"
            value={programStructure.length}
            onChange={(e) => handleChange("length", Number.parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={3}>3 weeks</option>
            <option value={4}>4 weeks</option>
            <option value={5}>5 weeks</option>
            <option value={6}>6 weeks</option>
            <option value={7}>7 weeks</option>
            <option value={8}>8 weeks</option>
          </select>
        </div>
      </div>

      <div className="mt-6 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h3 className="text-lg font-medium">Auto-Regulation</h3>
            <div className="relative ml-2">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
              {showTooltip && (
                <div className="absolute z-10 w-72 p-2 bg-gray-800 text-white text-xs rounded shadow-lg -left-36 top-6">
                  When enabled, auto-regulation adjusts the set volume across the weeks of your program based on your
                  feedback. This means that the system monitors your workout performance and recovery to dynamically
                  tailor the training load for optimal progression.
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">Automatically adjust training volume based on performance</p>
        <div className="flex items-center space-x-2">
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              id="auto-regulation"
              checked={autoRegulated}
              onChange={() => setAutoRegulated(!autoRegulated)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="auto-regulation"
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                autoRegulated ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></label>
          </div>
          <label htmlFor="auto-regulation" className="text-sm font-medium">
            {autoRegulated ? "Enabled" : "Disabled"}
          </label>
        </div>
      </div>
    </div>
  )
}
