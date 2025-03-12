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
          id: user.currentProgramId,
        },
        include: {
          weeks: {
            orderBy: {
              weekNo: "asc",
            },
            include: {
              workouts: {
                orderBy: {
                  workoutNo: "asc",
                },
                include: {
                  exercises: {
                    include: {
                      sets: {
                        orderBy: {
                          setNo: "asc",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      

    console.log(program);

    return NextResponse.json(program);

}
