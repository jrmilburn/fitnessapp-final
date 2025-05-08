import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const muscle = searchParams.get("muscle")
    const search = searchParams.get("search")

    // Build the where clause
    const whereClause = {
      OR: [{ isPublic: true }, { createdByUserId: user.id }],
    }

    // Add muscle filter if provided
    if (muscle && muscle !== "All") {
      whereClause.muscle = muscle
    }

    // Add search filter if provided
    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive", // Case-insensitive search
      }
    }

    // Fetch exercise templates
    const templates = await prisma.exerciseTemplate.findMany({
      where: whereClause,
      orderBy: {
        name: "asc",
      },
    })

    // Separate default (public) and user templates
    const defaultExercises = templates.filter((template) => template.isPublic)
    const userExercises = templates.filter((template) => !template.isPublic && template.userId === user.id)

    return NextResponse.json({
      defaultExercises,
      userExercises,
    })
  } catch (error) {
    console.error("Error fetching exercise templates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
