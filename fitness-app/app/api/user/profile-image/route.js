import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "../../../../lib/prisma"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        profilePicture: true,
      },
    })

    if (!user || !user.profilePicture) {
      return new Response("No profile image found", { status: 404 })
    }

    // Return the profile picture as an image
    return new Response(user.profilePicture, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error fetching profile image:", error)
    return new Response("Error fetching profile image", { status: 500 })
  }
}
