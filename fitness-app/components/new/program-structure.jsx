"use client"
import { useState } from "react"
import { HelpCircle } from "lucide-react"

export default function ProgramStructure({ programStructure, setProgramStructure }) {
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
    </div>
  )
}
