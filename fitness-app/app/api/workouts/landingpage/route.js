import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"

export async function GET() {

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })


    const workouts = await prisma.program.findUnique({
        where: {
            id: user.currentProgramId
        },
        select: {
            weeks: {
                select: {
                    workouts: {
                        orderBy: {
                            updatedAt: 'desc'
                        }
                    }
                    
                },
            }
        },
        
    })

    return NextResponse.json(workouts);

}