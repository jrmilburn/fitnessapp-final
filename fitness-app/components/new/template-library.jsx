"use client"

import { useState, useEffect } from "react"
import { Search, Info } from "lucide-react"

export default function TemplateLibrary({ onSelectTemplate }) {
  const [activeTab, setActiveTab] = useState("my")
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templateDetails, setTemplateDetails] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  // Fetch templates based on active tab
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true)
      try {
        const isPublic = activeTab === "public"
        const response = await fetch(`/api/program-templates?public=${isPublic}`)
        if (response.ok) {
          const data = await response.json()
          setTemplates(data)
        } else {
          console.error("Failed to fetch templates")
        }
      } catch (error) {
        console.error("Error fetching templates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [activeTab])

  // Fetch template details when a template is selected
  const fetchTemplateDetails = async (templateId) => {
    setIsLoadingDetails(true)
    try {
      const response = await fetch(`/api/program-templates/${templateId}`)
      if (response.ok) {
        const data = await response.json()
        setTemplateDetails(data)
      } else {
        console.error("Failed to fetch template details")
      }
    } catch (error) {
      console.error("Error fetching template details:", error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    fetchTemplateDetails(template.id)
  }

  // Handle using the selected template
  const handleUseTemplate = () => {
    if (templateDetails) {
      onSelectTemplate(templateDetails)
    }
  }

  // Filter templates based on search term
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex">
          <button
            className={`px-4 py-2 ${
              activeTab === "my" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } rounded-l-md`}
            onClick={() => setActiveTab("my")}
          >
            My Templates
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "public" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } rounded-r-md`}
            onClick={() => setActiveTab("public")}
          >
            Public Templates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 border border-gray-200 rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="font-medium">Templates</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading templates...</div>
            ) : filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedTemplate?.id === template.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-gray-500">
                    {template.length} weeks, {template.daysPerWeek} days/week
                  </div>
                  <div className="flex items-center mt-1">
                    {template.autoRegulated && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        Auto-Regulated
                      </span>
                    )}
                    {template.isPublic && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Public
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No templates found</div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 border border-gray-200 rounded-md overflow-y-auto max-h-[450px]">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="font-medium">Template Details</h3>
          </div>
          {selectedTemplate ? (
            isLoadingDetails ? (
              <div className="p-4 text-center text-gray-500">Loading details...</div>
            ) : templateDetails ? (
              <div className="p-4">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{templateDetails.name}</h2>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 mr-2">
                      {templateDetails.length} weeks, {templateDetails.daysPerWeek} days/week
                    </span>
                    {templateDetails.autoRegulated && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Auto-Regulated
                      </span>
                    )}
                  </div>
                  {templateDetails.comments && <p className="text-sm text-gray-600 mt-2">{templateDetails.comments}</p>}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Workouts</h3>
                  {templateDetails.weeks[0]?.workouts.map((workout) => (
                    <div key={workout.dayNo} className="border rounded-md p-3">
                      <h4 className="font-medium">{workout.name}</h4>
                      <div className="mt-2 space-y-1">
                        {workout.exercises.map((exercise, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{exercise.name}</span>
                            <span className="text-gray-500">{exercise.targetSets} sets</span>
                          </div>
                        ))}
                        {workout.exercises.length === 0 && <div className="text-sm text-gray-500">No exercises</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    onClick={handleUseTemplate}
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">Failed to load template details</div>
            )
          ) : (
            <div className="p-4 flex flex-col items-center justify-center text-center text-gray-500 h-64">
              <Info className="h-12 w-12 mb-2 text-gray-300" />
              <p>Select a template to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
