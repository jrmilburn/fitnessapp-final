import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"

// Update an exercise
export async function PUT(request) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, currentProgramId: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get request body
    const { exerciseId, templateId, updateAll, workoutId } = await request.json()

    // Get the exercise template
    const template = await prisma.exerciseTemplate.findUnique({
      where: { id: templateId },
      include: { muscleGroup: true },
    })

    if (!template) {
      return NextResponse.json({ error: "Exercise template not found" }, { status: 404 })
    }

    // Get the current exercise
    const currentExercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { workout: { include: { week: true } } },
    })

    if (!currentExercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 })
    }

    // Verify the exercise belongs to the user's current program
    const workout = await prisma.workout.findFirst({
      where: {
        id: workoutId,
        week: {
          program: {
            id: user.currentProgramId,
          },
        },
      },
    })

    if (!workout) {
      return NextResponse.json({ error: "Workout not found or not authorized" }, { status: 404 })
    }

    if (updateAll) {
      // Get all workouts in the current and future weeks
      const currentWeekNo = currentExercise.workout.week.weekNo

      const workouts = await prisma.workout.findMany({
        where: {
          week: {
            programId: user.currentProgramId,
            weekNo: {
              gte: currentWeekNo,
            },
          },
          workoutNo: currentExercise.workout.workoutNo,
        },
        include: {
          exercises: {
            where: {
              exerciseNo: currentExercise.exerciseNo,
            },
          },
        },
      })

      // Update all matching exercises in current and future workouts
      const updatePromises = workouts.flatMap((workout) =>
        workout.exercises.map((exercise) =>
          prisma.exercise.update({
            where: { id: exercise.id },
            data: {
              name: template.name,
              muscle: template.muscleGroup.name,
              templateId: template.id,
            },
          }),
        ),
      )

      await Promise.all(updatePromises)
    } else {
      // Update only the current exercise
      await prisma.exercise.update({
        where: { id: exerciseId },
        data: {
          name: template.name,
          muscle: template.muscleGroup.name,
          templateId: template.id,
        },
      })
    }

    // Fetch the updated program
    const updatedProgram = await prisma.program.findUnique({
      where: {
        id: user.currentProgramId,
      },
      include: {
        weeks: {
          orderBy: {
            weekNo: "asc",
          },
          include: {
            workouts: {
              orderBy: {
                workoutNo: "asc",
              },
              include: {
                exercises: {
                  orderBy: {
                    exerciseNo: "asc",
                  },
                  include: {
                    sets: {
                      orderBy: {
                        setNo: "asc",
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

    return NextResponse.json({ success: true, program: updatedProgram })
  } catch (error) {
    console.error("Error updating exercise:", error)
    return NextResponse.json({ error: "Failed to update exercise" }, { status: 500 })
  }
}

// Delete an exercise
export async function DELETE(request) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, currentProgramId: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get request body
    const { exerciseId } = await request.json()

    // Get the exercise
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        workout: {
          include: {
            week: true,
          },
        },
        sets: true,
      },
    })

    if (!exercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 })
    }

    // Verify the exercise belongs to the user's current program
    const programCheck = await prisma.program.findFirst({
      where: {
        id: user.currentProgramId,
        weeks: {
          some: {
            id: exercise.workout.weekId,
          },
        },
      },
    })

    if (!programCheck) {
      return NextResponse.json({ error: "Not authorized to delete this exercise" }, { status: 403 })
    }

    // Delete the exercise's sets first
    await prisma.set.deleteMany({
      where: {
        exerciseId: exerciseId,
      },
    })

    // Delete the exercise
    await prisma.exercise.delete({
      where: {
        id: exerciseId,
      },
    })

    // Update exerciseNo for remaining exercises in the workout
    const remainingExercises = await prisma.exercise.findMany({
      where: {
        workoutId: exercise.workoutId,
      },
      orderBy: {
        exerciseNo: "asc",
      },
    })

    const updatePromises = remainingExercises.map((ex, index) =>
      prisma.exercise.update({
        where: { id: ex.id },
        data: { exerciseNo: index },
      }),
    )

    await Promise.all(updatePromises)

    // Fetch the updated program
    const updatedProgram = await prisma.program.findUnique({
      where: {
        id: user.currentProgramId,
      },
      include: {
        weeks: {
          orderBy: {
            weekNo: "asc",
          },
          include: {
            workouts: {
              orderBy: {
                workoutNo: "asc",
              },
              include: {
                exercises: {
                  orderBy: {
                    exerciseNo: "asc",
                  },
                  include: {
                    sets: {
                      orderBy: {
                        setNo: "asc",
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

    return NextResponse.json({ success: true, program: updatedProgram })
  } catch (error) {
    console.error("Error deleting exercise:", error)
    return NextResponse.json({ error: "Failed to delete exercise" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, currentProgramId: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { name, muscle, workoutId, templateId, programId } = await request.json();

    const exerciseTemplate = await prisma.exerciseTemplate.findUnique({
      where: { id: templateId }
    })

    const exerciseCount = await prisma.exercise.count({
      where: { workoutId: workoutId }
    })

    const newExercise = await prisma.exercise.create({
      data: {
        name: name,
        exerciseNo: exerciseCount + 1,
        templateId: exerciseTemplate.id,
        muscle: muscle, 
        workoutId: workoutId
      }
    })

    const initialSets = await prisma.set.createMany({
      data: [
        {
          setNo: 0,
          exerciseId: newExercise.id
        },        {
          setNo: 1,
          exerciseId: newExercise.id
        }
      ]
    })

    const updatedProgram = await prisma.program.findUnique({
      where: {
        id: programId
      },
      include: {
        weeks: {
          include: {
            workouts: {
              include: {
                exercises: {
                  include: {
                    sets: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ success: true, program: updatedProgram })

  } catch(error) {
      console.error("Error adding exercise:", error)
      return NextResponse.json({ error: "Failed to add exercise" }, { status: 500 })
  }
}
