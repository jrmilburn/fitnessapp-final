import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

import { prisma } from "../../../lib/prisma";

export async function POST(request) {

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })

    const { workoutId, feedbackData } = await request.json()

    const workoutFeedBack = await CreateFeedback(workoutId, feedbackData);

    const nextWorkout = await UpdateVolume(workoutId, user.fatigue);

    const updatedProgram = await prisma.program.findUnique({
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


    return NextResponse.json({
        message: "Feedback submitted successfully",
        program: updatedProgram
    })

}

async function CreateFeedback(workoutId, feedbackData) {

    const feedbackPromises = Object.entries(feedbackData.muscles).map(async ([muscle, data]) => {
        const newFeedback = await prisma.muscleFeedback.create({
            data: {
                muscle,
                workoutId,
                workload: data.workload,
                jointpain: data.jointpain,
                soreness: data.soreness,
            },
        });
        return newFeedback;
    });

    const feedback = await Promise.all(feedbackPromises);
    return feedback;
}

async function UpdateVolume(workoutId, userFatigue) {

    const currentWorkout = await prisma.workout.findUnique({
        where: {
            id: workoutId
        },
        include: {
            exercises: true
        }
    })

    const nextWorkout = await prisma.workout.update({
        where: {
            id: currentWorkout.nextWorkoutId
        },
        data: {
            programmed: true
        }
    })

    const currentExercises = await prisma.exercise.findMany({
        where: {
            workoutId: currentWorkout.id
        },
        include: {
            sets: true
        }
    })

    const nextExercises = await prisma.exercise.findMany({
        where: {
            workoutId: nextWorkout.id
        }
    })

    const feedback = await prisma.muscleFeedback.findMany({
        where: {
            workoutId: currentWorkout.id
        }
    })

    await prisma.workout.update({
        where: {
            id: workoutId
        },
        data: {
            feedbackId: feedback[0].id
        }
    })

    for (let i = 0; i < nextExercises.length; i++) {

        const currentSetCount = currentExercises[i].sets.length;
        const newSetCount = CalculateSets(currentSetCount, feedback[0].workload, feedback[0].jointpain, feedback[0].soreness, userFatigue);
        
        for (let j = 0; j < Math.floor(newSetCount); j++) {

            const newSet = await prisma.set.create({
                data: {
                    exerciseId: nextExercises[i].id,
                    reps: 0,
                    weight: 0,
                    setNo: j + 1
                }
            })

        }


    }

    

}

/**This is the volume regulation algorithm */

function CalculateSets(currentSetCount, workload, jointpain, soreness, fatigue) {

    const normalisedWorkload  = -0.08 * workload  + 1.2;
    const normalisedJointPain = -0.08 * jointpain + 1.2;
    const normalisedSoreness  = -0.08 * soreness  + 1.2;
    const normalisedFatigue   = -0.08 * fatigue   + 1.2;
  
    const volumeFactor = normalisedWorkload * normalisedJointPain * normalisedSoreness * normalisedFatigue;
    
    const newSetCount = currentSetCount * volumeFactor;
  
    return newSetCount;
  }
  
