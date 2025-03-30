import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function PUT(request) {
  const { name, muscle, workoutId, all, currentName } = await request.json();

  console.log(name, muscle, workoutId, all);

  if (all) {
    // Fetch the current workout, including its week info and exercises.
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: { 
        week: true,
        exercises: true 
      },
    });

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Identify the exercise in this workout by the provided muscle.
    const currentExercise = workout.exercises.find(ex => ex.name === currentName);

    console.log(currentExercise);

    if (!currentExercise) {
      return NextResponse.json({ error: "Exercise not found in workout" }, { status: 404 });
    }
    const keyName = currentExercise.name;
    const workoutNo = workout.workoutNo;

    // Update all exercises in the same program, in workouts with the same workoutNo,
    // and where the week number is greater than or equal to the current workout's week.
    // Only exercises that originally have the same name (keyName) will be updated.
    const updateResult = await prisma.exercise.updateMany({
      where: {
        name: keyName,
        workout: {
          workoutNo: workoutNo,
          week: {
            programId: workout.week.programId,
            weekNo: { gte: workout.week.weekNo },
          },
        },
      },
      data: {
        name: name,
        muscle: muscle,
      },
    });

    const newProgram = await prisma.program.findUnique({
      where: {
        id: workout.week.programId
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
      message: "Exercise replaced for all remaining workouts",
      count: updateResult.count,
      program: newProgram
    });
  } else {
    // One-off replacement: just update the exercise in the current workout.
    const exercise = await prisma.exercise.findFirst({
      where: {
        workoutId: workoutId,
        muscle: muscle,
      },
    });

    if (!exercise) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    const updatedExercise = await prisma.exercise.update({
      where: { id: exercise.id },
      data: {
        name: name,
        muscle: muscle,
      },
    });

    return NextResponse.json({
      message: "Exercise replaced for the current workout",
      exerciseId: updatedExercise.id,
    });
  }
}


export async function POST(request) {

    const { workoutId, name, muscle } = await request.json();

    const exercises = await prisma.exercise.findMany({
        where: {
            workoutId: workoutId
        }
    })

    const newExercise = await prisma.exercise.create({
        data: {
            name: name,
            muscle: muscle,
            workoutId: workoutId,
            exerciseNo: exercises.length + 1
        },
        
    })

    return NextResponse.json({
        status: "Exercise created successfully",
        exercise: newExercise
    })

}

export async function DELETE(request) {

  const { exerciseId } = await request.json();

  await prisma.set.deleteMany({
    where: {
      exerciseId: exerciseId
    }
  })

  const deletedExercise = await prisma.exercise.delete({
    where: {
      id: exerciseId
    },
    include: {
      workout: {
        include: {
          week: true
        }
      }
    }
  })
  

  const newProgram = await prisma.program.findUnique({
    where: {
      id: deletedExercise.workout.week.programId
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
    message: "Exercise replaced for all remaining workouts",
    program: newProgram
  });

}