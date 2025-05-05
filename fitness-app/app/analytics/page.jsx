import { prisma } from "../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import AnalyticsDashboard from "./components/analytics-dashboard"

export default async function ExerciseAnalytics() {
  // Authenticate and load the current user
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return <div>Not authenticated</div>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user || !user.currentProgramId) {
    return <div>User or current program not found</div>
  }

  // Retrieve program data including weeks, workouts, and exercises
  const programData = await prisma.program.findUnique({
    where: { id: user.currentProgramId },
    select: {
      name: true,
      weeks: {
        select: {
          weekNo: true,
          workouts: {
            select: {
              id: true,
              name: true,
              workoutNo: true,
              exercises: {
                select: {
                  id: true,
                  name: true,
                  muscle: true,
                  sets: {
                    select: {
                      id: true,
                      setNo: true,
                      reps: true,
                      weight: true,
                      complete: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  // Redirect to '/new' if programData is not available
  if (!programData) {
    redirect("/new")
  }

  // Process data for analytics
  const processedData = processWorkoutData(programData)

  return (
    <div className="min-h-screen bg-gray-50">
      <AnalyticsDashboard programData={programData} processedData={processedData} />
    </div>
  )
}

// Process workout data for analytics
function processWorkoutData(programData) {
  const weeks = programData.weeks
  const totalWeeks = weeks.length

  // Volume data (sets per muscle group per week)
  const volumeData = {}

  // Weight data (average weight per exercise per week)
  const weightData = {}

  // Rep data (average reps per exercise per week)
  const repData = {}

  // Exercise tracking data
  const exerciseData = {}

  // Muscle group list for filtering
  const muscleGroups = new Set()

  // Exercise list for filtering
  const exercises = new Set()

  weeks.forEach((week, weekIndex) => {
    week.workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const muscle = exercise.muscle
        const exerciseName = exercise.name

        // Add to sets for filtering
        muscleGroups.add(muscle)
        exercises.add(exerciseName)

        // Process volume data (completed sets)
        const completedSets = exercise.sets.filter((set) => set.complete).length
        if (!volumeData[muscle]) {
          volumeData[muscle] = new Array(totalWeeks).fill(0)
        }
        volumeData[muscle][weekIndex] += completedSets

        // Process weight data
        const completedSetsWithWeight = exercise.sets.filter((set) => set.complete && set.weight > 0)
        if (completedSetsWithWeight.length > 0) {
          const avgWeight =
            completedSetsWithWeight.reduce((sum, set) => sum + set.weight, 0) / completedSetsWithWeight.length

          if (!weightData[exerciseName]) {
            weightData[exerciseName] = new Array(totalWeeks).fill(null)
          }
          weightData[exerciseName][weekIndex] = avgWeight
        }

        // Process rep data
        const completedSetsWithReps = exercise.sets.filter((set) => set.complete && set.reps > 0)
        if (completedSetsWithReps.length > 0) {
          const avgReps = completedSetsWithReps.reduce((sum, set) => sum + set.reps, 0) / completedSetsWithReps.length

          if (!repData[exerciseName]) {
            repData[exerciseName] = new Array(totalWeeks).fill(null)
          }
          repData[exerciseName][weekIndex] = avgReps
        }

        // Process exercise tracking data
        if (!exerciseData[exerciseName]) {
          exerciseData[exerciseName] = {
            muscle: muscle,
            weeks: new Array(totalWeeks).fill().map(() => ({
              sets: 0,
              totalWeight: 0,
              totalReps: 0,
              maxWeight: 0,
              maxReps: 0,
            })),
          }
        }

        exercise.sets.forEach((set) => {
          if (set.complete) {
            exerciseData[exerciseName].weeks[weekIndex].sets += 1
            exerciseData[exerciseName].weeks[weekIndex].totalWeight += set.weight || 0
            exerciseData[exerciseName].weeks[weekIndex].totalReps += set.reps || 0

            if ((set.weight || 0) > exerciseData[exerciseName].weeks[weekIndex].maxWeight) {
              exerciseData[exerciseName].weeks[weekIndex].maxWeight = set.weight || 0
            }

            if ((set.reps || 0) > exerciseData[exerciseName].weeks[weekIndex].maxReps) {
              exerciseData[exerciseName].weeks[weekIndex].maxReps = set.reps || 0
            }
          }
        })
      })
    })
  })

  // Create week labels
  const weekLabels = weeks.map((week) => `Week ${week.weekNo}`)

  return {
    volumeData,
    weightData,
    repData,
    exerciseData,
    muscleGroups: Array.from(muscleGroups).sort(),
    exercises: Array.from(exercises).sort(),
    weekLabels,
    totalWeeks,
  }
}
