"use client"

export default function NextWorkout({ program, setCurrentWorkout, workout }) {
  const allSetsComplete = program?.weeks
    .flatMap((week) => week.workouts)
    .flatMap((workout) => workout.exercises)
    .every((exercise) => exercise.sets.every((set) => set.complete))

  const nextWorkout = async (e) => {

      const nextWorkoutWithIncompleteSet = program.weeks
        .flatMap((week) => week.workouts)
        .find((workout) => workout.exercises.some((exercise) => exercise.sets.some((set) => !set.complete)))

      setCurrentWorkout(nextWorkoutWithIncompleteSet)
  }

  const finishProgram = () => {
    // Finish program logic
    alert("Congratulations on completing your program!")
  }

  return (
    <button
      type="button"
      onClick={workout?.feedbackId ? nextWorkout : allSetsComplete ? finishProgram : nextWorkout}
      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
    >
      {workout?.feedbackId ? "Current Workout" : allSetsComplete ? "Finish Program" : "Next Workout"}
    </button>
  )
}
