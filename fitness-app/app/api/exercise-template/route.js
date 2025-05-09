import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

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
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse the request body
    const body = await request.json()
    const { name, muscleGroupId, description, shortDescription, videoUrl, isPublic } = body

    // Validate required fields
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 })
    }

    if (!muscleGroupId) {
      return NextResponse.json({ error: "Muscle group is required" }, { status: 400 })
    }

    if (!shortDescription || shortDescription.length < 5) {
      return NextResponse.json({ error: "Short description must be at least 5 characters" }, { status: 400 })
    }

    // Check if the muscle group exists
    const muscleGroup = await prisma.muscleGroup.findUnique({
      where: { id: muscleGroupId },
    })

    if (!muscleGroup) {
      return NextResponse.json({ error: "Muscle group not found" }, { status: 404 })
    }

    // Check for duplicate exercise names for this user
    const existingExercise = await prisma.exerciseTemplate.findFirst({
      where: {
        createdByUserId: user.id,
        name: {
          equals: name,
          mode: "insensitive", // Case-insensitive comparison
        },
        isPublic: false, // Only check user's private exercises
      },
    })

    if (existingExercise) {
      return NextResponse.json(
        { error: "An exercise with this name already exists in your exercises" },
        { status: 400 },
      )
    }

    // Create the exercise template
    const exerciseTemplate = await prisma.exerciseTemplate.create({
      data: {
        name,
        description,
        shortDescription,
        videoUrl,
        isPublic,
        createdByUserId: user.id,
        muscleGroupId,
      },
      include: {
        muscleGroup: true,
      },
    })

    return NextResponse.json(exerciseTemplate, { status: 201 })
  } catch (error) {
    console.error("Error creating exercise template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'default' or 'user'
    const muscleGroupId = searchParams.get("muscleGroupId")

    // Build the where clause
    let whereClause = {}

    if (type === "default") {
      // Get all public exercise templates
      whereClause = {
        isPublic: true,
      }
    } else if (type === "user") {
      // Get user's private exercise templates
      whereClause = {
        createdByUserId: user.id,
        isPublic: false,
      }
    } else {
      // Get both public and user's private templates
      whereClause = {
        OR: [{ isPublic: true }, { createdByUserId: user.id }],
      }
    }

    // Add muscle group filter if provided
    if (muscleGroupId) {
      whereClause.muscleGroupId = muscleGroupId
    }

    // Fetch exercise templates with muscle group data
    const exercises = await prisma.exerciseTemplate.findMany({
      where: whereClause,
      include: {
        muscleGroup: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(exercises)
  } catch (error) {
    console.error("Error fetching exercise templates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse the request body
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 })
    }

    // Find the exercise template
    const exerciseTemplate = await prisma.exerciseTemplate.findUnique({
      where: { id },
    })

    if (!exerciseTemplate) {
      return NextResponse.json({ error: "Exercise template not found" }, { status: 404 })
    }

    // Check if the user owns the exercise or if they're an admin
    if (exerciseTemplate.createdByUserId !== user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: "You don't have permission to delete this exercise" }, { status: 403 })
    }

    // Delete the exercise template
    await prisma.exerciseTemplate.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting exercise template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
