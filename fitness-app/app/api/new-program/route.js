import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { templateId } = await request.json()

    // Fetch the template with all related data
    const template = await prisma.programTemplate.findUnique({
      where: { id: templateId },
      include: {
        weekTemplates: {
          orderBy: { weekNo: "asc" },
          include: {
            workoutTemplates: {
              orderBy: { dayNo: "asc" },
              include: {
                exerciseSlots: {
                  orderBy: { order: "asc" },
                  include: {
                    exerciseTemplate: {
                      include: {
                        muscleGroup: true
                      }
                    },
                    setTemplates: true
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Check if user has access to this template
    if (!template.isPublic && template.createdById !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Create the program
    const program = await prisma.program.create({
      data: {
        name: template.name,
        comments: template.comments,
        length: template.length,
        days: template.daysPerWeek,
        userId: user.id,
      },
    })

    const weeksToCreate = template.weekTemplates;

    // Create weeks and workouts
    for (const weekTemplate of weeksToCreate) {
      const week = await prisma.week.create({
        data: {
          weekNo: weekTemplate.weekNo,
          programId: program.id,
        },
      })

      for (const workoutTemplate of weekTemplate.workoutTemplates) {
        const workout = await prisma.workout.create({
          data: {
            name: workoutTemplate.name,
            workoutNo: workoutTemplate.dayNo,
            weekId: week.id,
            programmed: true,
          },
        })

        // Create exercises and sets
        for (const slot of workoutTemplate.exerciseSlots) {
          const exercise = await prisma.exercise.create({
            data: {
              name: slot.exerciseTemplate.name,
              muscle: slot.exerciseTemplate.muscleGroup?.name || "Unknown",
              exerciseNo: slot.order,
              workoutId: workout.id,
              templateId: slot.templateId,
            },
          })

          // Create sets
          for (const [idx, setTemp] of slot.setTemplates.entries()) {
            await prisma.set.create({
              data: {
                setNo:    idx + 1,          // ← idx starts at 0
                reps:     setTemp.reps,
                weight:   setTemp.weight,
                exerciseId: exercise.id,
              },
            });
          }
        }
      }
    }

    // Set this as the user's current program
    await prisma.user.update({
      where: { id: user.id },
      data: { currentProgramId: program.id },
    })

    return NextResponse.json({
      status: 201,
      message: "Program created successfully",
      programId: program.id,
    })
  } catch (error) {
    console.error("Error creating program:", error)
    return NextResponse.json({ error: "Failed to create program", details: error.message }, { status: 500 })
  }
}
