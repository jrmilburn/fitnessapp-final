import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

import { prisma } from "../../../lib/prisma";

export async function POST(request) {

    const { workoutId, feedbackData } = await request.json()

    const workoutFeedBack = await CreateFeedback(workoutId, feedbackData);

    const nextWorkout = await UpdateVolume(workoutId);


    return NextResponse.json({
        message: "Feedback submitted successfully"
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

async function UpdateVolume(workoutId) {

    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })

    const currentWorkout = await prisma.workout.findUnique({
        where: {
            id: workoutId
        },
        include: {
            exercises: true
        }
    })

    const nextWorkout = await prisma.workout.findUnique({
        where: {
            id: currentWorkout.nextWorkoutId
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

    console.log(feedback);

    for (let i = 0; i < nextExercises.length; i++) {

        const currentSetCount = currentExercises[i].sets.length;
        const newSetCount = CalculateSets(currentSetCount, feedback[0].workload, feedback[0].jointpain, feedback[0].soreness, user.fatigue);
        
        for (let j = 0; j < Math.floor(newSetCount); j++) {

            const newSet = await prisma.set.create({
                data: {
                    exerciseId: nextExercises[i].id,
                    reps: 0,
                    weight: 0,
                    setNo: j + 1
                }
            })

            console.log(newSet);

        }


    }

    

}

/**This is the volume regulation algorithm */

function CalculateSets(currentSetCount, workload, jointpain, soreness, fatigue) {

    console.log(currentSetCount);
    console.log(workload);
    console.log(jointpain);
    console.log(soreness);
    console.log(fatigue);

    const normalisedWorkload  = -0.08 * workload  + 1.2;
    const normalisedJointPain = -0.08 * jointpain + 1.2;
    const normalisedSoreness  = -0.08 * soreness  + 1.2;
    const normalisedFatigue   = -0.08 * fatigue   + 1.2;

    console.log(normalisedWorkload);
    console.log(normalisedJointPain);
    console.log(normalisedSoreness);
    console.log(normalisedFatigue);
  
    const volumeFactor = normalisedWorkload * normalisedJointPain * normalisedSoreness * normalisedFatigue;
    
    const newSetCount = currentSetCount * volumeFactor;
  
    return newSetCount;
  }
  
