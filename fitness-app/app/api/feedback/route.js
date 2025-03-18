import { NextResponse } from "next/server";

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

    const exercises = await prisma.exercise.findMany({
        where: {
            workoutId: nextWorkout.id
        }
    })

    const feedback = await prisma.muscleFeedback.findMany({
        where: {
            workoutId: currentWorkout.id
        }
    })

    console.log(exercises);
    console.log(feedback);

}

/**This is the volume regulation algorithm */

function CalculateSets(currentSetCount, workload, jointpain, soreness, fatigue) {
    // Normalize each input using the derived linear formula
    const normalisedWorkload  = -0.1 * workload  + 1.35;
    const normalisedJointPain = -0.1 * jointpain + 1.35;
    const normalisedSoreness  = -0.1 * soreness  + 1.35;
    const normalisedFatigue   = -0.1 * fatigue   + 1.35;
  
    const volumeFactor = currentSetCount * normalisedWorkload * normalisedJointPain * normalisedSoreness * normalisedFatigue;
    
    const newSetCount = currentSetCount * volumeFactor;
  
    return newSetCount;
  }
  
