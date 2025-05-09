import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"
import { prisma } from "../../../../lib/prisma"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "You must be signed in to complete onboarding" }, { status: 401 })
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
    if (profilePicture && profilePicture instanceof Blob) {
      // Convert the file to a Buffer
      const buffer = Buffer.from(await profilePicture.arrayBuffer())
      updateData.profilePicture = buffer
    }

    // Update the user profile
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: updateData,
    })

    return NextResponse.json({ message: "Onboarding completed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: "An error occurred during onboarding" }, { status: 500 })
  }
}
