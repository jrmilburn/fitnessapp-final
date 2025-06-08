import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"

// Get all program templates (public ones and user's own)
export async function GET(request) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const isPublic = searchParams.get("public") === "true"

    // Build the query
    const query = {
      where: {},
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            weekTemplates: true,
          },
        },
      },
    }

    // Filter by public or user's own templates
    if (isPublic) {
      query.where.isPublic = true
    } else {
      query.where.createdById = user.id
    }

    const templates = await prisma.programTemplate.findMany(query)

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching program templates:", error)
    return NextResponse.json({ error: "Failed to fetch program templates" }, { status: 500 })
  }
}

// Create a new program template
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

    const { template } = await request.json()

    // Create the program template
    const newTemplate = await prisma.programTemplate.create({
      data: {
        name: template.name,
        goal: template.goal,
        length: template.length,
        daysPerWeek: template.daysPerWeek,
        comments: template.comments,
        isPublic: template.isPublic || false,
        // Store the autoRegulated setting
        autoRegulated: template.autoRegulated || false,
        createdById: user.id,
        weekTemplates: {
          create: template.weeks.map((week) => ({
            weekNo: week.weekNo,
            workoutTemplates: {
              create: week.workouts.map((workout) => ({
                dayNo: workout.dayNo,
                name: workout.name,
                exerciseSlots: {
                  create: workout.exercises.map((exercise, index) => ({
                    order: index + 1,
                    targetSets: exercise.targetSets,
                    templateId: exercise.templateId,
                  })),
                },
              })),
            },
          })),
        },
      },
    })

    return NextResponse.json({
      status: 201,
      message: "Program template created successfully",
      templateId: newTemplate.id,
    })
  } catch (error) {
    console.error("Error creating program template:", error)
    return NextResponse.json({ error: "Failed to create program template", details: error.message }, { status: 500 })
  }
}
