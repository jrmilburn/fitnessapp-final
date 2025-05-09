// app/api/profile-picture/[userId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';          // adjust to your alias / path
import { Buffer } from 'buffer';                // works in Edge and Node

// 👉  uncomment if you *always* want Node (Buffer is native there)
// export const runtime = 'nodejs';

export async function GET(
  _req, { params },
) {
  const { userId } = await params;                    // dynamic segment

  try {
    // 1. fetch only what we need
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePicture: true },
    });

    if (!user?.profilePicture) {
      return NextResponse.json(
        { message: 'Profile picture not found' },
        { status: 404 },
      );
    }

    // 2. Ensure we have a Buffer, then to base-64
    const base64 = Buffer.from(user.profilePicture).toString('base64');
    const profilePictureUrl = `data:image/jpeg;base64,${base64}`;

    // 3. send it
    return NextResponse.json({ profilePictureUrl });
  } catch (err) {
    console.error('GET /profile-picture error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch profile picture' },
      { status: 500 },
    );
  }
}
