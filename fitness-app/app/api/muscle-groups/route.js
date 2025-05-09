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

    // Fetch all muscle groups
    const muscleGroups = await prisma.muscleGroup.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(muscleGroups)
  } catch (error) {
    console.error("Error fetching muscle groups:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
