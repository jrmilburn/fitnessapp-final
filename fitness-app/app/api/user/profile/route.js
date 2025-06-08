import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't send the actual profile picture in the initial response
    // to keep the payload small
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      hasProfilePicture: !!user.profilePicture,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the multipart form data
    const formData = await request.formData()
    const name = formData.get("name")
    const profilePicture = formData.get("profilePicture")

    // Validate the name
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Prepare update data
    const updateData = {
      name: name.trim(),
    }

    // Process profile picture if provided
    if (profilePicture && profilePicture) {
      // Convert the file to a Buffer
      const buffer = Buffer.from(await profilePicture.arrayBuffer())
      updateData.profilePicture = buffer
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
      },
    })

    // Return the updated user (without the actual profile picture)
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      hasProfilePicture: !!updatedUser.profilePicture,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
