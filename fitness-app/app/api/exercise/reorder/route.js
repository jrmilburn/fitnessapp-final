import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"

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
    const { workoutId, exercises } = await request.json()

    // Verify the workout belongs to the user's current program
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

    // Update exercise order
    const updatePromises = exercises.map((ex) =>
      prisma.exercise.update({
        where: { id: ex.id },
        data: { exerciseNo: ex.exerciseNo },
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
    console.error("Error reordering exercises:", error)
    return NextResponse.json({ error: "Failed to reorder exercises" }, { status: 500 })
  }
}
