import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })

    console.log(user);

    const program = await prisma.program.findUnique({
        where: {
            id: user.currentProgramId
        },
        include: {
            weeks: {
                include: {
                    workouts: {
                        include: {
                            exercises: {
                                include: {
                                    sets: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    console.log(program);

    return NextResponse.json(program);

}
