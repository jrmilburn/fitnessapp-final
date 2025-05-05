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

    const program = await prisma.program.findMany({
        where: {
            userId: user.id
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
      
    return NextResponse.json(program);

}
