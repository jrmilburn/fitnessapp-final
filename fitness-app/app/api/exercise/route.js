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
        id: updateResult.workout.week.programId
      },
      include: {
        weeks: {
          orderBy: {
            weekNo: 'asc'
          },
          include: {
            workouts: {
              orderBy: {
                workoutNo: 'asc'
              },
              include: {
                exercises: {
                  orderBy: {
                    exerciseNo: 'asc'
                  },
                  include: {
                    sets: {
                      orderBy: {
                        setNo: 'asc'
                      }
                    }
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
    // One-off replacement: update only the specified exercise in the current workout.
    
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
  
    // Identify the exercise in this workout by the provided currentName.
    const currentExercise = workout.exercises.find(ex => ex.name === currentName);
  
    if (!currentExercise) {
      return NextResponse.json({ error: "Exercise not found in workout" }, { status: 404 });
    }
  
    // Update only this exercise.
    const updatedExercise = await prisma.exercise.update({
      where: { id: currentExercise.id },
      data: {
        name: name,
        muscle: muscle,
      },
      include: {
        workout: {
          include: {
            week: true
          }
        }
      }
    });
  
    // Fetch the updated program details.
    const newProgram = await prisma.program.findUnique({
      where: {
        id: updatedExercise.workout.week.programId
      },
      include: {
        weeks: {
          orderBy: {
            weekNo: 'asc'
          },
          include: {
            workouts: {
              orderBy: {
                workoutNo: 'asc'
              },
              include: {
                exercises: {
                  orderBy: {
                    exerciseNo: 'asc'
                  },
                  include: {
                    sets: {
                      orderBy: {
                        setNo: 'asc'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  
    return NextResponse.json({
      message: "Exercise replaced for the current workout",
      exerciseId: updatedExercise.id,
      program: newProgram
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
        include: {
          workout: {
            include: {
              week: true
            }
          }
        }
    })

    for (let i = 0; i < 2; i++) {
      await prisma.set.create({
        data: {
          setNo: i + 1,
          exerciseId: newExercise.id
        }
      })
    }

    const newProgram = await prisma.program.findUnique({
      where: {
        id: newExercise.workout.week.programId
      },
      include: {
        weeks: {
          orderBy: {
            weekNo: 'asc'
          },
          include: {
            workouts: {
              orderBy: {
                workoutNo: 'asc'
              },
              include: {
                exercises: {
                  orderBy: {
                    exerciseNo: 'asc'
                  },
                  include: {
                    sets: {
                      orderBy: {
                        setNo: 'asc'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
        status: "Exercise created successfully",
        exercise: newExercise,
        program: newProgram
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
        orderBy: {
          weekNo: 'asc'
        },
        include: {
          workouts: {
            orderBy: {
              workoutNo: 'asc'
            },
            include: {
              exercises: {
                orderBy: {
                  exerciseNo: 'asc'
                },
                include: {
                  sets: {
                    orderBy: {
                      setNo: 'asc'
                    }
                  }
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

export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany({
      distinct: ['name'], // Adjust the field name(s) as needed
    });

    return new Response(JSON.stringify(exercises), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Error fetching exercises' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
