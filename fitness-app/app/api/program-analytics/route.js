import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"

// Update the GET function to properly handle the response
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const programId = searchParams.get("programId")

  console.log("API request for program:", programId)

  // Authenticate the user
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
    },
  })

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Fetch all programs for this user
  const userPrograms = await prisma.program.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      createdAt: true,
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
                      createdAt: true,
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

  // Process data based on the requested program
  let currentProgramData

  if (programId === "all") {
    // Process data for all programs combined
    currentProgramData = processAllProgramsData(userPrograms)
    console.log("Processed data for all programs")
  } else {
    // Find the specific program
    const selectedProgram = userPrograms.find((p) => p.id === programId)

    if (!selectedProgram) {
      return new Response(JSON.stringify({ error: "Program not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Process data for the specific program
    currentProgramData = processProgramData(selectedProgram)
    console.log("Processed data for program:", programId)
  }

  return new Response(JSON.stringify({ currentProgramData }), {
    headers: { "Content-Type": "application/json" },
  })
}

// In the processAllProgramsData function, modify the section where we process data for each week
// to filter out weeks with no data for the selected filters.
// Replace the entire processAllProgramsData function with this improved version:

function processAllProgramsData(programs) {
  // Combine data from all programs
  const volumeData = {}
  const weightData = {}
  const repData = {}
  const exerciseData = {}
  const muscleGroups = new Set()
  const exercises = new Set()

  // First, collect all unique exercises and muscle groups
  programs.forEach((program) => {
    program.weeks.forEach((week) => {
      week.workouts.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          muscleGroups.add(exercise.muscle)
          exercises.add(exercise.name)
        })
      })
    })
  })

  // Create a unified sequence of weeks across all programs
  const allWeeks = []
  programs.forEach((program) => {
    program.weeks.forEach((week) => {
      // Create a unique identifier for this week
      const weekIdentifier = `${program.name} - Week ${week.weekNo}`
      if (!allWeeks.find((w) => w.id === weekIdentifier)) {
        allWeeks.push({
          id: weekIdentifier,
          programId: program.id,
          programName: program.name,
          weekNo: week.weekNo,
          weekData: week,
          hasData: false, // We'll set this to true if we find data for this week
        })
      }
    })
  })

  // Sort weeks by program creation date and then by week number
  allWeeks.sort((a, b) => {
    const programA = programs.find((p) => p.id === a.programId)
    const programB = programs.find((p) => p.id === b.programId)

    // First sort by program creation date
    const dateA = new Date(programA.createdAt)
    const dateB = new Date(programB.createdAt)

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB
    }

    // If same program, sort by week number
    return a.weekNo - b.weekNo
  })

  // Initialize data structures for each week
  allWeeks.forEach((_, weekIndex) => {
    // Initialize volume data for each muscle group
    muscleGroups.forEach((muscle) => {
      if (!volumeData[muscle]) {
        volumeData[muscle] = new Array(allWeeks.length).fill(0)
      }
    })

    // Initialize weight and rep data for each exercise
    exercises.forEach((exerciseName) => {
      if (!weightData[exerciseName]) {
        weightData[exerciseName] = new Array(allWeeks.length).fill(null)
      }
      if (!repData[exerciseName]) {
        repData[exerciseName] = new Array(allWeeks.length).fill(null)
      }
      if (!exerciseData[exerciseName]) {
        exerciseData[exerciseName] = {
          muscle: "", // Will be set when processing exercises
          weeks: new Array(allWeeks.length).fill().map(() => ({
            sets: 0,
            totalWeight: 0,
            totalReps: 0,
            maxWeight: 0,
            maxReps: 0,
            estimatedOneRM: 0,
          })),
        }
      }
    })
  })

  // Process data for each week
  allWeeks.forEach((weekInfo, weekIndex) => {
    const week = weekInfo.weekData

    week.workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const muscle = exercise.muscle
        const exerciseName = exercise.name

        // Ensure muscle is set in exerciseData
        if (exerciseData[exerciseName]) {
          exerciseData[exerciseName].muscle = muscle
        }

        const completedSets = exercise.sets.filter((set) => set.complete).length
        if (completedSets > 0) {
          volumeData[muscle][weekIndex] += completedSets
          weekInfo.hasData = true // Mark this week as having data
        }

        const completedSetsWithWeight = exercise.sets.filter((set) => set.complete && set.weight > 0)
        if (completedSetsWithWeight.length > 0) {
          const avgWeight =
            completedSetsWithWeight.reduce((sum, set) => sum + set.weight, 0) / completedSetsWithWeight.length

          // If we already have data for this week, use the higher value
          if (weightData[exerciseName][weekIndex] !== null) {
            weightData[exerciseName][weekIndex] = Math.max(weightData[exerciseName][weekIndex], avgWeight)
          } else {
            weightData[exerciseName][weekIndex] = avgWeight
          }
          weekInfo.hasData = true // Mark this week as having data
        }

        const completedSetsWithReps = exercise.sets.filter((set) => set.complete && set.reps > 0)
        if (completedSetsWithReps.length > 0) {
          const avgReps = completedSetsWithReps.reduce((sum, set) => sum + set.reps, 0) / completedSetsWithReps.length

          // If we already have data for this week, use the higher value
          if (repData[exerciseName][weekIndex] !== null) {
            repData[exerciseName][weekIndex] = Math.max(repData[exerciseName][weekIndex], avgReps)
          } else {
            repData[exerciseName][weekIndex] = avgReps
          }
          weekInfo.hasData = true // Mark this week as having data
        }

        // Process exercise tracking data
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
            weekInfo.hasData = true // Mark this week as having data
          }
        })
      })
    })
  })

  // Filter out weeks with no data
  const weeksWithData = allWeeks.filter((week) => week.hasData)
  const weekIndicesWithData = allWeeks.map((week, index) => (week.hasData ? index : -1)).filter((index) => index !== -1)

  // Create filtered data arrays
  const filteredVolumeData = {}
  const filteredWeightData = {}
  const filteredRepData = {}
  const filteredExerciseData = {}

  // Filter volume data
  Object.keys(volumeData).forEach((muscle) => {
    filteredVolumeData[muscle] = weekIndicesWithData.map((index) => volumeData[muscle][index])
  })

  // Filter weight data
  Object.keys(weightData).forEach((exercise) => {
    filteredWeightData[exercise] = weekIndicesWithData.map((index) => weightData[exercise][index])
  })

  // Filter rep data
  Object.keys(repData).forEach((exercise) => {
    filteredRepData[exercise] = weekIndicesWithData.map((index) => repData[exercise][index])
  })

  // Filter exercise data
  Object.keys(exerciseData).forEach((exercise) => {
    filteredExerciseData[exercise] = {
      muscle: exerciseData[exercise].muscle,
      weeks: weekIndicesWithData.map((index) => exerciseData[exercise].weeks[index]),
    }
  })

  // Create week labels for weeks with data
  const weekLabels = weeksWithData.map((week) => `${week.programName} - Week ${week.weekNo}`)

  return {
    volumeData: filteredVolumeData,
    weightData: filteredWeightData,
    repData: filteredRepData,
    exerciseData: filteredExerciseData,
    muscleGroups: Array.from(muscleGroups).sort(),
    exercises: Array.from(exercises).sort(),
    weekLabels,
    totalWeeks: weeksWithData.length,
    isDateBased: false, // We're using workout days, not calendar dates
  }
}

// Also update the processProgramData function to filter out weeks with no data
function processProgramData(program) {
  const volumeData = {}
  const weightData = {}
  const repData = {}
  const exerciseData = {}
  const muscleGroups = new Set()
  const exercises = new Set()
  const weekLabels = []
  let totalWeeks = 0

  // Sort weeks by weekNo to ensure chronological order
  const sortedWeeks = [...program.weeks].sort((a, b) => a.weekNo - b.weekNo)

  // Track which weeks have data
  const weeksWithData = []
  const weekHasData = new Array(sortedWeeks.length).fill(false)

  sortedWeeks.forEach((week, weekIndex) => {
    let hasDataForWeek = false

    week.workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const muscle = exercise.muscle
        const exerciseName = exercise.name

        muscleGroups.add(muscle)
        exercises.add(exerciseName)

        const completedSets = exercise.sets.filter((set) => set.complete).length
        if (completedSets > 0) {
          if (!volumeData[muscle]) {
            volumeData[muscle] = new Array(sortedWeeks.length).fill(0)
          }
          volumeData[muscle][weekIndex] = (volumeData[muscle][weekIndex] || 0) + completedSets
          hasDataForWeek = true
        }

        const completedSetsWithWeight = exercise.sets.filter((set) => set.complete && set.weight > 0)
        if (completedSetsWithWeight.length > 0) {
          const avgWeight =
            completedSetsWithWeight.reduce((sum, set) => sum + set.weight, 0) / completedSetsWithWeight.length
          if (!weightData[exerciseName]) {
            weightData[exerciseName] = new Array(sortedWeeks.length).fill(null)
          }
          weightData[exerciseName][weekIndex] = avgWeight
          hasDataForWeek = true
        }

        const completedSetsWithReps = exercise.sets.filter((set) => set.complete && set.reps > 0)
        if (completedSetsWithReps.length > 0) {
          const avgReps = completedSetsWithReps.reduce((sum, set) => sum + set.reps, 0) / completedSetsWithReps.length
          if (!repData[exerciseName]) {
            repData[exerciseName] = new Array(sortedWeeks.length).fill(null)
          }
          repData[exerciseName][weekIndex] = avgReps
          hasDataForWeek = true
        }

        if (!exerciseData[exerciseName]) {
          exerciseData[exerciseName] = {
            muscle: muscle,
            weeks: new Array(sortedWeeks.length).fill().map(() => ({
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

            if (set.weight > 0 && set.reps > 0 && set.reps <= 10) {
              const oneRM = set.weight * (36 / (37 - set.reps))
              if (oneRM > exerciseData[exerciseName].weeks[weekIndex].estimatedOneRM) {
                exerciseData[exerciseName].weeks[weekIndex].estimatedOneRM = oneRM
              }
            }
            hasDataForWeek = true
          }
        })
      })
    })

    if (hasDataForWeek) {
      weekHasData[weekIndex] = true
      weeksWithData.push(week)
      weekLabels.push(`Week ${week.weekNo}`)
      totalWeeks++
    }
  })

  // Filter out weeks with no data
  const weekIndicesWithData = weekHasData
    .map((hasData, index) => (hasData ? index : -1))
    .filter((index) => index !== -1)

  // Create filtered data arrays
  const filteredVolumeData = {}
  const filteredWeightData = {}
  const filteredRepData = {}
  const filteredExerciseData = {}

  // Filter volume data
  Object.keys(volumeData).forEach((muscle) => {
    filteredVolumeData[muscle] = weekIndicesWithData.map((index) => volumeData[muscle][index])
  })

  // Filter weight data
  Object.keys(weightData).forEach((exercise) => {
    filteredWeightData[exercise] = weekIndicesWithData.map((index) => weightData[exercise][index])
  })

  // Filter rep data
  Object.keys(repData).forEach((exercise) => {
    filteredRepData[exercise] = weekIndicesWithData.map((index) => repData[exercise][index])
  })

  // Filter exercise data
  Object.keys(exerciseData).forEach((exercise) => {
    filteredExerciseData[exercise] = {
      muscle: exerciseData[exercise].muscle,
      weeks: weekIndicesWithData.map((index) => exerciseData[exercise].weeks[index]),
    }
  })

  return {
    volumeData: filteredVolumeData,
    weightData: filteredWeightData,
    repData: filteredRepData,
    exerciseData: filteredExerciseData,
    muscleGroups: Array.from(muscleGroups).sort(),
    exercises: Array.from(exercises).sort(),
    weekLabels,
    totalWeeks,
    isDateBased: false,
  }
}
