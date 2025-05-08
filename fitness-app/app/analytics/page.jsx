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
    select: {
      id: true,
      email: true,
      currentProgramId: true,
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  // Retrieve ALL programs for this user
  const userPrograms = await prisma.program.findMany({
    where: { userId: user.id },
    select: {
      id: true,
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

  // Redirect to '/new' if no programs are available
  if (!userPrograms || userPrograms.length === 0) {
    redirect("/new")
  }

  // Find the current program in the list
  const currentProgram = user.currentProgramId
    ? userPrograms.find((program) => program.id === user.currentProgramId) || userPrograms[0]
    : userPrograms[0]

  // Process data for analytics
  const processedData = processWorkoutData(userPrograms, currentProgram?.id || "all")

  return (
    <div className="min-h-screen bg-gray-50">
      <AnalyticsDashboard
        allPrograms={userPrograms}
        currentProgramId={currentProgram.id}
        processedData={processedData}
      />
    </div>
  )
}

// Process workout data for analytics
function processWorkoutData(programs, currentProgramId) {
  // Create a map of all exercises across all programs
  const allExercises = new Map()
  const allMuscleGroups = new Set()
  const programMap = new Map()

  // First pass: collect all unique exercises and their muscle groups
  programs.forEach((program) => {
    programMap.set(program.id, {
      id: program.id,
      name: program.name,
      createdAt: program.createdAt,
    })

    program.weeks.forEach((week) => {
      week.workouts.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          allMuscleGroups.add(exercise.muscle)

          if (!allExercises.has(exercise.name)) {
            allExercises.set(exercise.name, {
              name: exercise.name,
              muscle: exercise.muscle,
              programs: new Set(),
              sets: [],
              oneRepMax: {
                value: 0,
                weight: 0,
                reps: 0,
                date: null,
                programId: null,
              },
            })
          }

          const exerciseData = allExercises.get(exercise.name)
          exerciseData.programs.add(program.id)

          // Add all sets to the exercise data
          exercise.sets.forEach((set) => {
            if (set.complete && set.weight > 0 && set.reps > 0) {
              exerciseData.sets.push({
                weight: set.weight,
                reps: set.reps,
                date: set.updatedAt || set.createdAt,
                programId: program.id,
                weekNo: week.weekNo,
              })

              // Calculate one-rep max using Brzycki formula: weight * (36 / (37 - reps))
              if (set.reps <= 10) {
                // Formula is most accurate for reps <= 10
                const oneRM = set.weight * (36 / (37 - set.reps))
                if (oneRM > exerciseData.oneRepMax.value) {
                  exerciseData.oneRepMax = {
                    value: oneRM,
                    weight: set.weight,
                    reps: set.reps,
                    date: set.updatedAt || set.createdAt,
                    programId: program.id,
                  }
                }
              }
            }
          })
        })
      })
    })
  })

  // Process current program data - handle "all" case
  let currentProgramData

  if (currentProgramId === "all") {
    // For "all" selection, combine data from all programs
    currentProgramData = processAllProgramsData(programs)
  } else {
    // Process specific program data
    const currentProgram = programs.find((p) => p.id === currentProgramId) || programs[0]
    if (!currentProgram) {
      // Fallback if no program is found
      currentProgramData = {
        volumeData: {},
        weightData: {},
        repData: {},
        exerciseData: {},
        muscleGroups: [],
        exercises: [],
        weekLabels: [],
        totalWeeks: 0,
      }
    } else {
      const processProgramData = (program) => {
        const volumeData = {}
        const weightData = {}
        const repData = {}
        const exerciseData = {}
        const muscleGroups = new Set()
        const exercises = new Set()
        const weekLabels = []
        let totalWeeks = 0

        program.weeks.forEach((week, weekIndex) => {
          weekLabels.push(`Week ${week.weekNo}`)
          totalWeeks++

          week.workouts.forEach((workout) => {
            workout.exercises.forEach((exercise) => {
              const muscle = exercise.muscle
              const exerciseName = exercise.name

              muscleGroups.add(muscle)
              exercises.add(exerciseName)

              const completedSets = exercise.sets.filter((set) => set.complete).length
              if (!volumeData[muscle]) {
                volumeData[muscle] = []
              }
              volumeData[muscle][weekIndex] = (volumeData[muscle][weekIndex] || 0) + completedSets

              const completedSetsWithWeight = exercise.sets.filter((set) => set.complete && set.weight > 0)
              if (completedSetsWithWeight.length > 0) {
                const avgWeight =
                  completedSetsWithWeight.reduce((sum, set) => sum + set.weight, 0) / completedSetsWithWeight.length
                if (!weightData[exerciseName]) {
                  weightData[exerciseName] = []
                }
                weightData[exerciseName][weekIndex] = avgWeight
              }

              const completedSetsWithReps = exercise.sets.filter((set) => set.complete && set.reps > 0)
              if (completedSetsWithReps.length > 0) {
                const avgReps =
                  completedSetsWithReps.reduce((sum, set) => sum + set.reps, 0) / completedSetsWithReps.length
                if (!repData[exerciseName]) {
                  repData[exerciseName] = []
                }
                repData[exerciseName][weekIndex] = avgReps
              }

              if (!exerciseData[exerciseName]) {
                exerciseData[exerciseName] = {
                  muscle: muscle,
                  weeks: [],
                }
              }

              if (!exerciseData[exerciseName].weeks[weekIndex]) {
                exerciseData[exerciseName].weeks[weekIndex] = {
                  sets: 0,
                  totalWeight: 0,
                  totalReps: 0,
                  maxWeight: 0,
                  maxReps: 0,
                  estimatedOneRM: 0,
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

                  if (set.weight > 0 && set.reps > 0 && set.reps <= 10) {
                    const oneRM = set.weight * (36 / (37 - set.reps))
                    if (oneRM > exerciseData[exerciseName].weeks[weekIndex].estimatedOneRM) {
                      exerciseData[exerciseName].weeks[weekIndex].estimatedOneRM = oneRM
                    }
                  }
                }
              })
            })
          })
        })

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
      currentProgramData = processProgramData(currentProgram)
    }
  }

  // Process all-time exercise data
  const exerciseProgressionData = {}

  allExercises.forEach((exerciseData, exerciseName) => {
    // Sort sets by date
    exerciseData.sets.sort((a, b) => new Date(a.date) - new Date(b.date))

    // Group sets by month for long-term tracking
    const setsByMonth = {}
    const setsByProgram = {}

    exerciseData.sets.forEach((set) => {
      const date = new Date(set.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!setsByMonth[monthKey]) {
        setsByMonth[monthKey] = {
          totalWeight: 0,
          totalReps: 0,
          count: 0,
          maxWeight: 0,
          maxReps: 0,
        }
      }

      setsByMonth[monthKey].totalWeight += set.weight
      setsByMonth[monthKey].totalReps += set.reps
      setsByMonth[monthKey].count++
      setsByMonth[monthKey].maxWeight = Math.max(setsByMonth[monthKey].maxWeight, set.weight)
      setsByMonth[monthKey].maxReps = Math.max(setsByMonth[monthKey].maxReps, set.reps)

      // Group by program
      if (!setsByProgram[set.programId]) {
        setsByProgram[set.programId] = {
          totalWeight: 0,
          totalReps: 0,
          count: 0,
          maxWeight: 0,
          maxReps: 0,
          weeks: {},
        }
      }

      setsByProgram[set.programId].totalWeight += set.weight
      setsByProgram[set.programId].totalReps += set.reps
      setsByProgram[set.programId].count++
      setsByProgram[set.programId].maxWeight = Math.max(setsByProgram[set.programId].maxWeight, set.weight)
      setsByProgram[set.programId].maxReps = Math.max(setsByProgram[set.programId].maxReps, set.reps)

      // Group by week within program
      if (!setsByProgram[set.programId].weeks[set.weekNo]) {
        setsByProgram[set.programId].weeks[set.weekNo] = {
          totalWeight: 0,
          totalReps: 0,
          count: 0,
          maxWeight: 0,
          maxReps: 0,
        }
      }

      const weekData = setsByProgram[set.programId].weeks[set.weekNo]
      weekData.totalWeight += set.weight
      weekData.totalReps += set.reps
      weekData.count++
      weekData.maxWeight = Math.max(weekData.maxWeight, set.weight)
      weekData.maxReps = Math.max(weekData.maxReps, set.reps)
    })

    // Calculate averages and create time series data
    const timeSeriesData = Object.keys(setsByMonth)
      .sort()
      .map((month) => {
        const data = setsByMonth[month]
        return {
          month,
          avgWeight: data.count > 0 ? data.totalWeight / data.count : 0,
          avgReps: data.count > 0 ? data.totalReps / data.count : 0,
          maxWeight: data.maxWeight,
          maxReps: data.maxReps,
          estimatedOneRM: data.maxWeight * (36 / (37 - Math.min(data.maxReps, 10))),
        }
      })

    // Process program-specific data
    const programData = {}
    Object.keys(setsByProgram).forEach((programId) => {
      const data = setsByProgram[programId]
      const program = programMap.get(programId)

      if (!program) return // Skip if program not found

      // Process week data
      const weekData = {}
      Object.keys(data.weeks).forEach((weekNo) => {
        const week = data.weeks[weekNo]
        weekData[weekNo] = {
          avgWeight: week.count > 0 ? week.totalWeight / week.count : 0,
          avgReps: week.count > 0 ? week.totalReps / week.count : 0,
          maxWeight: week.maxWeight,
          maxReps: week.maxReps,
          estimatedOneRM: week.maxWeight * (36 / (37 - Math.min(week.maxReps, 10))),
        }
      })

      programData[programId] = {
        programName: program.name,
        avgWeight: data.count > 0 ? data.totalWeight / data.count : 0,
        avgReps: data.count > 0 ? data.totalReps / data.count : 0,
        maxWeight: data.maxWeight,
        maxReps: data.maxReps,
        estimatedOneRM: data.maxWeight * (36 / (37 - Math.min(data.maxReps, 10))),
        weekData,
      }
    })

    exerciseProgressionData[exerciseName] = {
      muscle: exerciseData.muscle,
      oneRepMax: exerciseData.oneRepMax,
      timeSeriesData,
      programData,
      programs: Array.from(exerciseData.programs)
        .map((id) => {
          const program = programMap.get(id)
          return program ? { id, name: program.name } : null
        })
        .filter(Boolean),
    }
  })

  return {
    currentProgramData,
    exerciseProgressionData,
    muscleGroups: Array.from(allMuscleGroups).sort(),
    exercises: Array.from(allExercises.keys()).sort(),
    programs: Array.from(programMap.values()),
  }
}

// Add a new function to process data from all programs combined
function processAllProgramsData(programs) {
  // Combine data from all programs
  const volumeData = {}
  const weightData = {}
  const repData = {}
  const exerciseData = {}
  const muscleGroups = new Set()
  const exercises = new Set()

  // Find the maximum number of weeks across all programs
  const maxWeeks = Math.max(...programs.map((program) => program.weeks.length), 0)

  // Create week labels
  const weekLabels = Array.from({ length: maxWeeks }, (_, i) => `Week ${i + 1}`)

  // Process data from each program
  programs.forEach((program) => {
    program.weeks.forEach((week, weekIndex) => {
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
            volumeData[muscle] = new Array(maxWeeks).fill(0)
          }
          volumeData[muscle][weekIndex] = (volumeData[muscle][weekIndex] || 0) + completedSets

          // Process weight data
          const completedSetsWithWeight = exercise.sets.filter((set) => set.complete && set.weight > 0)
          if (completedSetsWithWeight.length > 0) {
            const avgWeight =
              completedSetsWithWeight.reduce((sum, set) => sum + set.weight, 0) / completedSetsWithWeight.length

            if (!weightData[exerciseName]) {
              weightData[exerciseName] = new Array(maxWeeks).fill(null)
            }

            // If we already have data for this week, average it with the new data
            if (weightData[exerciseName][weekIndex] !== null) {
              weightData[exerciseName][weekIndex] = (weightData[exerciseName][weekIndex] + avgWeight) / 2
            } else {
              weightData[exerciseName][weekIndex] = avgWeight
            }
          }

          // Process rep data
          const completedSetsWithReps = exercise.sets.filter((set) => set.complete && set.reps > 0)
          if (completedSetsWithReps.length > 0) {
            const avgReps = completedSetsWithReps.reduce((sum, set) => sum + set.reps, 0) / completedSetsWithReps.length

            if (!repData[exerciseName]) {
              repData[exerciseName] = new Array(maxWeeks).fill(null)
            }

            // If we already have data for this week, average it with the new data
            if (repData[exerciseName][weekIndex] !== null) {
              repData[exerciseName][weekIndex] = (repData[exerciseName][weekIndex] + avgReps) / 2
            } else {
              repData[exerciseName][weekIndex] = avgReps
            }
          }

          // Process exercise tracking data
          if (!exerciseData[exerciseName]) {
            exerciseData[exerciseName] = {
              muscle: muscle,
              weeks: new Array(maxWeeks).fill().map(() => ({
                sets: 0,
                totalWeight: 0,
                totalReps: 0,
                maxWeight: 0,
                maxReps: 0,
                estimatedOneRM: 0,
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

              // Calculate estimated one-rep max using Brzycki formula
              if (set.weight > 0 && set.reps > 0 && set.reps <= 10) {
                const oneRM = set.weight * (36 / (37 - set.reps))
                if (oneRM > exerciseData[exerciseName].weeks[weekIndex].estimatedOneRM) {
                  exerciseData[exerciseName].weeks[weekIndex].estimatedOneRM = oneRM
                }
              }
            }
          })
        })
      })
    })
  })

  return {
    volumeData,
    weightData,
    repData,
    exerciseData,
    muscleGroups: Array.from(muscleGroups).sort(),
    exercises: Array.from(exercises).sort(),
    weekLabels,
    totalWeeks: maxWeeks,
  }
}
