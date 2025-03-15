import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })

    const { weekLayout, programStructure } = await request.json();

    const newProgram = await prisma.program.create({
        data: {
          name: programStructure.name,
          comments: programStructure.comments,
          length: parseInt(programStructure.length, 10),
          days: parseInt(programStructure.days, 10),
          userId: user.id
        }
      });
      

    for (let i = 0; i < weekLayout.length; i++) {
        const newWeek = await prisma.week.create({
            data: {
                weekNo: i + 1,
                programId: newProgram.id
            }
        })

        for (let j = 0; j < weekLayout[i].workouts.length; j++) {
            const newWorkout = await prisma.workout.create({
                data: {
                    name: weekLayout[i].workouts[j].name,
                    workoutNo: weekLayout[i].workouts[j].workoutNo,
                    weekId: newWeek.id
                }
            })

            for (let k = 0; k < weekLayout[i].workouts[j].exercises.length; k++) {
                const newExercise = await prisma.exercise.create({
                    data: {
                        name: weekLayout[i].workouts[j].exercises[k].name,
                        muscle: weekLayout[i].workouts[j].exercises[k].muscle,
                        exerciseNo: k + 1,
                        workoutId: newWorkout.id
                    }
                })

                for (let l = 0; l < weekLayout[i].workouts[j].exercises[k].sets.length; l++) {
                    const newSet = await prisma.set.create({
                        data: {
                            setNo: l + 1,
                            weight: 0,
                            reps: 0,
                            complete: false,
                            exerciseId: newExercise.id
                        }
                    })

                    console.log(newSet);

                }

            }

        }

    }

    /**update user current program */
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            currentProgramId: newProgram.id
        }
    })

    return NextResponse.json({
        status: 201,
        message: "Program created successfully"
    })
}