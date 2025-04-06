"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Exercises from "../../components/exercise/Exercises"

export default function ExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    fetch('/api/exercise')
      .then(response => response.json())
      .then(data => {
        if (!data || data.length === 0) {
          router.push("/new");
          return;
        }
        setExercises(data);
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {exercises.length !== 0 && (
        <div className="flex-1 w-full flex flex-col gap-4 overflow-none">
          <Exercises
            exercises={exercises}
          />
        </div>
      )}
    </div>
  )
}
