"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProgramBrowser from "./components/program-browser"
import { Dumbbell } from "lucide-react"

export default function ProgramPage() {
  const router = useRouter()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/programs")
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) {
          router.push("/new")
          return
        }
        setPrograms(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching programs:", error)
        setLoading(false)
      })
  }, [router])

  const handleDeleteProgram = async (programId) => {
    try {
      const response = await fetch("/api/program", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId }),
      })

      if (response.ok) {
        const data = await response.json()
        setPrograms(data.programs)

        if (data.programs.length === 0) {
          router.push("/new")
        }
      }
    } catch (error) {
      console.error("Error deleting program:", error)
    }
  }

  if (loading) {
    return (
      <div className="max-h-[calc(100vh - 112px)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Dumbbell className="h-12 w-12 text-blue-600 animate-pulse mb-4" />
          <p className="text-gray-600">Loading your programs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-[calc(100vh - 112px)] bg-gray-50">
      <ProgramBrowser programs={programs} onDeleteProgram={handleDeleteProgram} />
    </div>
  )
}
