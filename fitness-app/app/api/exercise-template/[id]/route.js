import { prisma } from "../../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Get the exercise template
    const exerciseTemplate = await prisma.exerciseTemplate.findUnique({
      where: { id },
    })

    if (!exerciseTemplate) {
      return NextResponse.json({ error: "Exercise template not found" }, { status: 404 })
    }

    // Check if the user has access to this template
    if (!exerciseTemplate.isPublic) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })

      if (exerciseTemplate.userId !== user.id) {
        return NextResponse.json({ error: "You don't have permission to view this exercise" }, { status: 403 })
      }
    }

    return NextResponse.json(exerciseTemplate)
  } catch (error) {
    console.error("Error fetching exercise template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isAdmin: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { id } = params
    const body = await request.json()
    const { name, muscle, description, isPublic } = body

    // Validate required fields
    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 })
    }

    if (!muscle) {
      return NextResponse.json({ error: "Muscle group is required" }, { status: 400 })
    }

    // Find the exercise template
    const exerciseTemplate = await prisma.exerciseTemplate.findUnique({
      where: { id },
    })

    if (!exerciseTemplate) {
      return NextResponse.json({ error: "Exercise template not found" }, { status: 404 })
    }

    // Check if the user owns the exercise or if they're an admin
    if (exerciseTemplate.userId !== user.id && !user.isAdmin) {
      return NextResponse.json({ error: "You don't have permission to update this exercise" }, { status: 403 })
    }

    // Check for duplicate exercise names for this user (excluding the current exercise)
    if (name !== exerciseTemplate.name) {
      const existingExercise = await prisma.exerciseTemplate.findFirst({
        where: {
          userId: user.id,
          name: {
            equals: name,
            mode: "insensitive", // Case-insensitive comparison
          },
          isPublic: false, // Only check user's private exercises
          id: { not: id }, // Exclude the current exercise
        },
      })

      if (existingExercise) {
        return NextResponse.json(
          { error: "An exercise with this name already exists in your exercises" },
          { status: 400 },
        )
      }
    }

    // Update the exercise template
    const updatedTemplate = await prisma.exerciseTemplate.update({
      where: { id },
      data: {
        name,
        muscle,
        description,
        isPublic,
      },
    })

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error("Error updating exercise template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isAdmin: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { id } = params

    // Find the exercise template
    const exerciseTemplate = await prisma.exerciseTemplate.findUnique({
      where: { id },
    })

    if (!exerciseTemplate) {
      return NextResponse.json({ error: "Exercise template not found" }, { status: 404 })
    }

    // Check if the user owns the exercise or if they're an admin
    if (exerciseTemplate.userId !== user.id && !user.isAdmin) {
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
