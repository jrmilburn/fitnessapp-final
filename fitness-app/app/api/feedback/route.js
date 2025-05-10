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
            sets: true,
            template: {
                include: {
                    muscleGroup: true
                }
            }
        }
    })

    const nextExercises = await prisma.exercise.findMany({
        where: {
            workoutId: nextWorkout.id
        },

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
        const muscleGroup = currentExercises[i].template.muscleGroup.name;
        const newSetCount = CalculateSets(muscleGroup, currentSetCount, feedback[0].workload, feedback[0].jointpain, feedback[0].soreness, userFatigue);
        
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

/* Recovery rates (>1 = faster) */
const recoveryFactors = {
    Quads:     1.30,
    Hamstrings:1.00,
    Calves:    1.40,
    Glutes:    1.20,
    Abs:       1.20,
    Back:      0.95,
    Chest:     0.80,
    Shoulders: 1.10,
    Biceps:    0.90,
    Triceps:   0.85
  };
  
  /**
   * Calculate next-week set target for ONE exercise.
   * @param {string} muscleGroup   e.g. "Back"
   * @param {number} currentSets   existing number of sets for this exercise
   * @param {number} workload      1–5 (5 = maximal effort)
   * @param {number} jointPain     1–5 (5 = severe pain)
   * @param {number} soreness      1–5 (5 = very sore)
   * @param {number} fatigue       1–5 (5 = wiped-out)
   * @returns {number} new set count
   */
  function CalculateSets (muscleGroup,
                          currentSets,
                          workload,
                          jointPain,
                          soreness,
                          fatigue) {
    /* ---------- 1. Convert 1-5 ratings to +/- contributions ---------- */
    const boost   = rating => (3 - rating) * 0.25; // workload, heavier weight
    const relief  = rating => (3 - rating) * 0.15; // pain / soreness / fatigue
  
    const delta =
          boost(workload) +
          relief(jointPain) +
          relief(soreness)  +
          relief(fatigue);
  
    /* ---------- 2. Raw multiplier ---------- */
    let volumeMult = 1 + delta;              // baseline 1.0
    volumeMult = Math.max(0.60, Math.min(volumeMult, 1.60));  // cap before recovery
  
    /* ---------- 3. Muscle-specific recovery rate ---------- */
    const rec = recoveryFactors[muscleGroup] || 1.0;
    volumeMult *= rec;                       // e.g. Calves 1.4 → extra boost
  
    /* ---------- 4. Proposed set count & clamps ---------- */
    let proposed = Math.round(currentSets * volumeMult);
  
    // Always add at least +1 if multiplier clearly > 1.10
    if (proposed <= currentSets && volumeMult > 1.10) proposed = currentSets + 1;
  
    let deltaSets = proposed - currentSets;
    deltaSets     = Math.max(-2, Math.min(deltaSets, 5));     // −2 … +5 guardrail
    let newSets   = currentSets + deltaSets;
  
    /* ---------- 5. Safety: drop to 0 only from 1 set w/ bad feedback ---------- */
    const awful = (jointPain >= 4 || soreness >= 4 || fatigue >= 4) && workload <= 2;
    if (currentSets === 1 && awful) newSets = 0;
    if (newSets < 1) newSets = 1;   // final floor
  
    return newSets;
  }
  
  
  
  
  
