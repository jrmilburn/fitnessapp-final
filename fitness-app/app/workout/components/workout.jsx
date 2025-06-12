"use client"

import { useState } from "react"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import Exercise from "./exercise"
import { CheckCircle, AlertCircle, Lock } from "lucide-react"
import { toast } from "react-hot-toast"
import NextWorkout from "./next-workout"

export default function Workout({ workout, setProgram, program, setCurrentWorkout, viewonly }) {
  const [expandedMuscleGroup, setExpandedMuscleGroup] = useState(null)

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No workout selected</h2>
        <p className="text-gray-600 text-center">Please select a workout from the program or create a new one.</p>
      </div>
    )
  }

  // Group exercises by muscle
  const exercisesByMuscle = workout.exercises.reduce((groups, exercise) => {
    const muscle = exercise.muscle || "Other"
    if (!groups[muscle]) {
      groups[muscle] = []
    }
    groups[muscle].push(exercise)
    return groups
  }, {})

  // Check if all exercises are complete
  const isWorkoutComplete = workout.exercises.every((exercise) => exercise.sets.every((set) => set.complete))

  // Handle drag end for exercise reordering
  const handleDragEnd = async (result) => {
    // If in view-only mode, don't allow reordering
    if (viewonly) return

    const { destination, source, draggableId } = result

    // If dropped outside a droppable area or in the same position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Extract muscle group from droppable ID
    const sourceMuscle = source.droppableId.replace("muscle-", "")
    const destMuscle = destination.droppableId.replace("muscle-", "")

    // Get the exercise that was moved
    const movedExercise = workout.exercises.find((ex) => ex.id === draggableId)
    if (!movedExercise) return

    // Create a new array of exercises with updated order
    const updatedExercises = [...workout.exercises]

    // Remove the exercise from its original position
    const [removed] = updatedExercises.splice(
      updatedExercises.findIndex((ex) => ex.id === draggableId),
      1,
    )

    // Find the index where to insert the exercise
    let insertIndex = 0
    let currentIndex = 0

    for (const ex of updatedExercises) {
      if (ex.muscle === destMuscle) {
        if (currentIndex === destination.index) {
          insertIndex = updatedExercises.indexOf(ex)
          break
        }
        currentIndex++
      }
      if (currentIndex === 0 && updatedExercises.indexOf(ex) === updatedExercises.length - 1) {
        insertIndex = updatedExercises.length
      }
    }

    // If no exercises of the destination muscle group exist yet
    if (currentIndex === 0 && destination.index === 0) {
      // Find the first exercise of the next muscle group
      const muscleGroups = Object.keys(exercisesByMuscle).sort()
      const destIndex = muscleGroups.indexOf(destMuscle)

      if (destIndex < muscleGroups.length - 1) {
        const nextMuscle = muscleGroups[destIndex + 1]
        const firstExOfNextMuscle = updatedExercises.find((ex) => ex.muscle === nextMuscle)
        if (firstExOfNextMuscle) {
          insertIndex = updatedExercises.indexOf(firstExOfNextMuscle)
        }
      }
    }

    // Insert the exercise at the new position
    updatedExercises.splice(insertIndex, 0, removed)

    // Update exerciseNo for all exercises
    updatedExercises.forEach((ex, index) => {
      ex.exerciseNo = index
    })

    // Optimistically update the UI
    setProgram((prevProgram) => {
      const updatedProgram = JSON.parse(JSON.stringify(prevProgram))
      const workoutToUpdate = updatedProgram.weeks.flatMap((week) => week.workouts).find((w) => w.id === workout.id)

      if (workoutToUpdate) {
        workoutToUpdate.exercises = updatedExercises
      }

      return updatedProgram
    })

    // Send the update to the server
    try {
      const response = await fetch("/api/exercise/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutId: workout.id,
          exercises: updatedExercises.map((ex) => ({
            id: ex.id,
            exerciseNo: ex.exerciseNo,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update exercise order")
      }

      toast.success("Exercise order updated")
    } catch (error) {
      console.error("Error updating exercise order:", error)
      toast.error("Failed to update exercise order")

      // Revert the optimistic update
      fetch("/api/program")
        .then((response) => response.json())
        .then((data) => {
          setProgram(data)
        })
    }
  }

  return (
    <div className="w-full mx-auto flex flex-col">
      {/* View-only indicator */}
      {viewonly && (
        <div className="mb-4 p-3 rounded-lg bg-gray-100 text-gray-700 flex items-center">
          <Lock className="h-5 w-5 mr-2 text-gray-500" />
          <span>This workout is complete and can no longer be edited</span>
        </div>
      )}

      {/* Workout status indicator */}
      {!viewonly && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center ${
            isWorkoutComplete ? "bg-green-50 text-green-800" : "bg-blue-50 text-blue-800"
          }`}
        >
          {isWorkoutComplete ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Workout complete! Great job!</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Complete all sets to finish this workout</span>
            </>
          )}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Exercises grouped by muscle */}
        {Object.entries(exercisesByMuscle).map(([muscle, exercises]) => (
          <div key={muscle} className="mb-4">
            <div
              className="bg-gray-100 p-3 rounded-t-lg font-medium text-gray-700 flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedMuscleGroup(expandedMuscleGroup === muscle ? null : muscle)}
            >
              <span>{muscle}</span>
              <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-full">
                {exercises.length} {exercises.length === 1 ? "exercise" : "exercises"}
              </span>
            </div>

            <Droppable droppableId={`muscle-${muscle}`} isDropDisabled={viewonly}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${expandedMuscleGroup === muscle || expandedMuscleGroup === null ? "block" : "hidden"}`}
                >
                  {exercises
                    .sort((a, b) => a.exerciseNo - b.exerciseNo)
                    .map((exercise, index) => (
                      <Exercise
                        key={exercise.id}
                        exercise={exercise}
                        setProgram={setProgram}
                        program={program}
                        workout={workout}
                        viewonly={viewonly}
                        index={index}
                      />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>

      {isWorkoutComplete && (
        <NextWorkout 
          program={program}
          setCurrentWorkout={setCurrentWorkout}
          workout={workout}
        />
      )}
    </div>
  )
}
