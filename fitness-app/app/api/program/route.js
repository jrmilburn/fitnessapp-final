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
                    orderBy: {
                      exerciseNo: "asc",
                    },
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

export async function DELETE(request) {
  const { programId } = await request.json();

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email
    }
  });

  try {
    // Get all weeks associated with the program
    const weeks = await prisma.week.findMany({
      where: { programId },
      select: { id: true }
    });
    const weekIds = weeks.map(week => week.id);

    // Get all workouts associated with those weeks
    const workouts = await prisma.workout.findMany({
      where: { weekId: { in: weekIds } },
      select: { id: true }
    });
    const workoutIds = workouts.map(workout => workout.id);

    // Get all exercises associated with those workouts
    const exercises = await prisma.exercise.findMany({
      where: { workoutId: { in: workoutIds } },
      select: { id: true }
    });
    const exerciseIds = exercises.map(exercise => exercise.id);

    // Use a transaction to ensure atomicity of deletions
    await prisma.$transaction([
      // Delete sets that reference the exercises
      prisma.set.deleteMany({
        where: { exerciseId: { in: exerciseIds } }
      }),
      // Delete exercises that reference the workouts
      prisma.exercise.deleteMany({
        where: { workoutId: { in: workoutIds } }
      }),
      // Delete muscleFeedback that reference the workouts
      prisma.muscleFeedback.deleteMany({
        where: { workoutId: { in: workoutIds } }
      }),
      // Delete workouts that reference the weeks
      prisma.workout.deleteMany({
        where: { weekId: { in: weekIds } }
      }),
      // Delete weeks that reference the program
      prisma.week.deleteMany({
        where: { programId }
      }),
      // Finally, delete the program itself
      prisma.program.delete({
        where: { id: programId }
      })
    ]);

    const newProgramList = await prisma.program.findMany({
      where: {
        userId: user.id
      }
    });

    return new Response(
      JSON.stringify({
        message: "Program and all related data successfully deleted.",
        programs: newProgramList
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting program:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while deleting the program." }),
      { status: 500 }
    );
  }
}


