import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"

// Get a specific program template with all details
export async function GET(request, { params }) {
  try {
    const { id } = params

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

    // Fetch the template with all related data
    const template = await prisma.programTemplate.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
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
                        muscleGroup: true,
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

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Check if user has access to this template
    if (!template.isPublic && template.createdById !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Transform the data to match the expected format in the frontend
    const transformedTemplate = {
      id: template.id,
      name: template.name,
      goal: template.goal,
      length: template.length,
      daysPerWeek: template.daysPerWeek,
      comments: template.comments,
      isPublic: template.isPublic,
      // Include autoRegulated in the response
      autoRegulated: template.autoRegulated,
      createdBy: template.createdBy,
      createdAt: template.createdAt,
      weeks: template.weekTemplates.map((weekTemplate) => ({
        weekNo: weekTemplate.weekNo,
        workouts: weekTemplate.workoutTemplates.map((workoutTemplate) => ({
          dayNo: workoutTemplate.dayNo,
          name: workoutTemplate.name,
          exercises: workoutTemplate.exerciseSlots.map((slot) => ({
            templateId: slot.exerciseTemplate.id,
            name: slot.exerciseTemplate.name,
            muscle: slot.exerciseTemplate.muscleGroup?.name || "Unknown",
            targetSets: slot.targetSets,
            exerciseTemplate: slot.exerciseTemplate,
          })),
        })),
      })),
    }

    return NextResponse.json(transformedTemplate)
  } catch (error) {
    console.error("Error fetching program template:", error)
    return NextResponse.json({ error: "Failed to fetch program template" }, { status: 500 })
  }
}

// Delete a program template
export async function DELETE(request, { params }) {
  try {
    const { id } = params

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

    // Check if template exists and belongs to user
    const existingTemplate = await prisma.programTemplate.findUnique({
      where: { id },
    })

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    if (existingTemplate.createdById !== user.id) {
      return NextResponse.json({ error: "You can only delete your own templates" }, { status: 403 })
    }

    // Delete the template and all related data (cascade delete should handle children)
    await prisma.programTemplate.delete({
      where: { id },
    })

    return NextResponse.json({
      status: 200,
      message: "Program template deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting program template:", error)
    return NextResponse.json({ error: "Failed to delete program template" }, { status: 500 })
  }
}
