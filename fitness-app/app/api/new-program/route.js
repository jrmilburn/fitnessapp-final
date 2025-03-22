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

    const { weekLayout, programStructure, autoRegulated } = await request.json();

    const newProgram = await CreateProgram(user.id, weekLayout, programStructure, autoRegulated);

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

async function CreateProgram(userId, weekLayout, programStructure, autoRegulated) {

    const newProgram = await prisma.program.create({
        data: {
          name: programStructure.name,
          comments: programStructure.comments,
          length: parseInt(programStructure.length, 10),
          days: parseInt(programStructure.days, 10),
          userId: userId,
          autoRegulated: autoRegulated
        }
      });
      

      const weekWorkoutMap = []; // This will store each week's mapping: { workoutNo: workoutId }

      for (let i = 0; i < weekLayout.length; i++) {
        // Create the week record
        const newWeek = await prisma.week.create({
          data: {
            weekNo: i + 1,
            programId: newProgram.id,
          },
        });
      
        const currentWeekWorkoutMap = {}; // Maps workoutNo => workout.id for the current week
      
        for (let j = 0; j < weekLayout[i].workouts.length; j++) {
          // Create the workout record
          const newWorkout = await prisma.workout.create({
            data: {
              name: weekLayout[i].workouts[j].name,
              workoutNo: weekLayout[i].workouts[j].workoutNo,
              weekId: newWeek.id,
              programmed: (i + 1 === 1 || !autoRegulated)
            },
          });
      
          // If this isn't the first week, attempt to find a matching workout from the previous week.
          if (i > 0) {
            const prevWeekMap = weekWorkoutMap[i - 1];
            const previousWorkoutId = prevWeekMap[newWorkout.workoutNo];
            if (previousWorkoutId) {
              // Update the current workout to reference the previous workout.
              await prisma.workout.update({
                where: { id: newWorkout.id },
                data: { previousWorkoutId: previousWorkoutId },
              });
      
              // Update the previous workout to reference the current workout as its next.
              await prisma.workout.update({
                where: { id: previousWorkoutId },
                data: { nextWorkoutId: newWorkout.id },
              });
            }
          }
      
          // Save the current workout in the mapping for later reference.
          currentWeekWorkoutMap[newWorkout.workoutNo] = newWorkout.id;
      
          // Create exercises for this workout.
          for (let k = 0; k < weekLayout[i].workouts[j].exercises.length; k++) {
            const newExercise = await prisma.exercise.create({
              data: {
                name: weekLayout[i].workouts[j].exercises[k].name,
                muscle: weekLayout[i].workouts[j].exercises[k].muscle,
                exerciseNo: k + 1,
                workoutId: newWorkout.id,
              },
            });
      
            // Create sets for the exercise.
            for (let l = 0; (l < weekLayout[i].workouts[j].exercises[k].sets.length && (!newProgram.autoRegulated || newWeek.weekNo === 1)); l++) {
              const newSet = await prisma.set.create({
                data: {
                  setNo: l + 1,
                  weight: 0,
                  reps: 0,
                  complete: false,
                  exerciseId: newExercise.id,
                },
              });
              console.log(newSet);
            }
          }
        }
      
        // Add the current week's mapping to the overall array.
        weekWorkoutMap.push(currentWeekWorkoutMap);
      }

      return newProgram;
      

}