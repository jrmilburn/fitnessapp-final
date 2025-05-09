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
            exercises: true,
        }
    })

    if(currentWorkout.nextWorkoutId) {


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

    

}

/**This is the volume regulation algorithm */

// Define recovery factors for each muscle group (>1 = faster recovery, <1 = slower)
const recoveryFactors = {
    "Quads": 1.3,
    "Hamstrings": 1.0,
    "Calves": 1.4,
    "Glutes": 1.2,
    "Abs": 1.2,
    "Back": 0.95,
    "Chest": 0.8,
    "Shoulders": 1.1,
    "Biceps": 0.9,
    "Triceps": 0.85
  };
  
  function CalculateSets(muscleGroup, workload, jointPain, soreness, fatigue) {
    // Normalize inputs from 1–5 scale (baseline 3 = neutral)
    const baseline = 3;
    const maxDelta = 2;  // max deviation (5-3 or 1-3)
    // Positive driver: workload (higher = more volume)
    let workloadFactor = (workload - baseline) / maxDelta;    // range -1 to +1
    // Negative drivers: joint pain, soreness, fatigue (higher = less volume)
    let painFactor    = (jointPain - baseline) / maxDelta;    // -1 to +1
    let sorenessFactor = (soreness - baseline) / maxDelta;    // -1 to +1
    let fatigueFactor  = (fatigue - baseline) / maxDelta;     // -1 to +1
  
    // Combine factors: start at 1.0 (baseline volume), add workload effect, subtract average of fatigue factors
    let volumeFactor = 1.0 
      + workloadFactor 
      - ((painFactor + sorenessFactor + fatigueFactor) / 3);
  
    // **Incorporate muscle recovery rate:** multiply by muscle's recoveryFactor 
    let recoveryFactor = recoveryFactors[muscleGroup] || 1.0;  // default 1.0 if not found
    volumeFactor *= recoveryFactor;
  
    // Ensure volumeFactor is not negative (in case of extreme inputs)
    if (volumeFactor < 0) volumeFactor = 0;
  
    // Calculate recommended sets (assuming a baselineSets value in the broader program)
    const baselineSets = 10;  // example baseline for normalization (could be adjusted as needed)
    let recommendedSets = Math.round(baselineSets * volumeFactor);
  
    return recommendedSets;
  }
  
  
