import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Program 1: Full Body Hypertrophy 3x/week
  await prisma.programTemplate.create({
    data: {
      name: 'Full Body Hypertrophy 3x/week',
      daysPerWeek: 3,
      length: 8,
      autoRegulated: false,
      isPublic: true,
      weekTemplates: {
        create: [
          {
            weekNo: 1,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Workout A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Barbell Bent-Over Row' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Leg Curl' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 2,
                  name: 'Workout B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Deadlift' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Overhead Press' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Pull-Up' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Leg Extension' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 3,
                  name: 'Workout C',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Leg Press' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Incline Dumbbell Bench Press' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Dumbbell Row' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Barbell Curl' } }, targetSets: 2 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Standing Calf Raise' } }, targetSets: 2 }
                    ]
                  }
                }
              ]
            }
          },
          {
            weekNo: 2,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Workout A',
                  exerciseSlots: { create: [ /* same exercises as Week 1 Workout A */ ] }
                },
                {
                  dayNo: 2,
                  name: 'Workout B',
                  exerciseSlots: { create: [ /* same exercises as Week 1 Workout B */ ] }
                },
                {
                  dayNo: 3,
                  name: 'Workout C',
                  exerciseSlots: { create: [ /* same exercises as Week 1 Workout C */ ] }
                }
              ]
            }
          },
          // ... weekTemplates 3 and 4 (identical to Week 1 structure)
          {
            weekNo: 5,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Workout A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 4 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Barbell Bent-Over Row' } }, targetSets: 4 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Leg Curl' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 2,
                  name: 'Workout B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Deadlift' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Overhead Press' } }, targetSets: 4 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Pull-Up' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Leg Extension' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 3,
                  name: 'Workout C',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Leg Press' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Incline Dumbbell Bench Press' } }, targetSets: 4 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Dumbbell Row' } }, targetSets: 4 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Barbell Curl' } }, targetSets: 3 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Standing Calf Raise' } }, targetSets: 3 }
                    ]
                  }
                }
              ]
            }
          }
          // ... weekTemplates 6, 7, 8 (identical to Week 5 structure)
        ]
      }
    }
  });

  // Program 2: Upper/Lower 4-Day Split
  await prisma.programTemplate.create({
    data: {
      name: 'Upper/Lower 4-Day Split',
      daysPerWeek: 4,
      length: 8,
      autoRegulated: false,
      isPublic: true,
      weekTemplates: {
        create: [
          {
            weekNo: 1,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Upper A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Bent-Over Row' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Lat Pulldown' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Dumbbell Lateral Raise' } }, targetSets: 2 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Triceps Pushdown' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 2,
                  name: 'Lower A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Romanian Deadlift' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Leg Extension' } }, targetSets: 2 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Standing Calf Raise' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 3,
                  name: 'Upper B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Overhead Press' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Pull-Up' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Seated Cable Row' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Incline Dumbbell Bench Press' } }, targetSets: 3 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Dumbbell Curl' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 4,
                  name: 'Lower B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Deadlift' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Leg Press' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Leg Curl' } }, targetSets: 2 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Seated Calf Raise' } }, targetSets: 2 }
                    ]
                  }
                }
              ]
            }
          },
          // ... weekTemplates 2, 3, 4 (identical to Week 1 structure)
          {
            weekNo: 5,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Upper A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Bent-Over Row' } }, targetSets: 4 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Lat Pulldown' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Dumbbell Lateral Raise' } }, targetSets: 3 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Triceps Pushdown' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 2,
                  name: 'Lower A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Romanian Deadlift' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Leg Extension' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Standing Calf Raise' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 3,
                  name: 'Upper B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Overhead Press' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Pull-Up' } }, targetSets: 4 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Seated Cable Row' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Incline Dumbbell Bench Press' } }, targetSets: 4 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Dumbbell Curl' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 4,
                  name: 'Lower B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Deadlift' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Leg Press' } }, targetSets: 4 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Leg Curl' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Seated Calf Raise' } }, targetSets: 3 }
                    ]
                  }
                }
              ]
            }
          }
          // ... weekTemplates 6, 7, 8 (identical to Week 5 structure)
        ]
      }
    }
  });

  // Program 3: Push/Pull/Legs 5-Day Split
  await prisma.programTemplate.create({
    data: {
      name: 'Push/Pull/Legs 5-Day Split',
      daysPerWeek: 5,
      length: 6,
      autoRegulated: false,
      isPublic: true,
      weekTemplates: {
        create: [
          {
            weekNo: 1,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Push A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Incline Dumbbell Bench Press' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Dumbbell Fly' } }, targetSets: 2 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Triceps Pushdown' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 2,
                  name: 'Pull A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Deadlift' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Pull-Up' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Seated Cable Row' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Barbell Curl' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 3,
                  name: 'Legs',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Romanian Deadlift' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Leg Press' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Leg Extension' } }, targetSets: 2 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Standing Calf Raise' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 4,
                  name: 'Push B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Overhead Press' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Dip' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Dumbbell Lateral Raise' } }, targetSets: 2 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Overhead Triceps Extension' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 5,
                  name: 'Pull B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Bent-Over Row' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Lat Pulldown' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Face Pull' } }, targetSets: 2 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Hammer Curl' } }, targetSets: 2 }
                    ]
                  }
                }
              ]
            }
          },
          {
            weekNo: 2,
            workoutTemplates: {
              create: [
                { dayNo: 1, name: 'Push A', exerciseSlots: { create: [ /* same as Week 1 Push A */ ] } },
                { dayNo: 2, name: 'Pull A', exerciseSlots: { create: [ /* same as Week 1 Pull A */ ] } },
                { dayNo: 3, name: 'Legs',  exerciseSlots: { create: [ /* same as Week 1 Legs */ ] } },
                { dayNo: 4, name: 'Push B', exerciseSlots: { create: [ /* same as Week 1 Push B */ ] } },
                { dayNo: 5, name: 'Pull B', exerciseSlots: { create: [ /* same as Week 1 Pull B */ ] } }
              ]
            }
          },
          // ... weekTemplates 3 (same as Week 1 structure)
          {
            weekNo: 4,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Push A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Incline Dumbbell Bench Press' } }, targetSets: 4 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Dumbbell Fly' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Triceps Pushdown' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 2,
                  name: 'Pull A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Deadlift' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Pull-Up' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Seated Cable Row' } }, targetSets: 4 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Barbell Curl' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 3,
                  name: 'Legs',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 5 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Romanian Deadlift' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Leg Press' } }, targetSets: 4 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Leg Extension' } }, targetSets: 3 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Standing Calf Raise' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 4,
                  name: 'Push B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Overhead Press' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Dip' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Dumbbell Lateral Raise' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Overhead Triceps Extension' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 5,
                  name: 'Pull B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Bent-Over Row' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Lat Pulldown' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Face Pull' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Hammer Curl' } }, targetSets: 3 }
                    ]
                  }
                }
              ]
            }
          },
          // ... Week 5 and 6 (identical to Week 4 structure)
        ]
      }
    }
  });

  // Program 4: 5x5 Strength Program
  await prisma.programTemplate.create({
    data: {
      name: '5x5 Strength Program',
      daysPerWeek: 3,
      length: 12,
      autoRegulated: false,
      isPublic: true,
      weekTemplates: {
        create: [
          {
            weekNo: 1,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Workout A',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 5 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 5 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Barbell Bent-Over Row' } }, targetSets: 5 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Barbell Curl' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 2,
                  name: 'Workout B',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 5 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Overhead Press' } }, targetSets: 5 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Barbell Deadlift' } }, targetSets: 1 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Pull-Up' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 3,
                  name: 'Workout A',
                  exerciseSlots: { create: [ /* same as Day 1 Workout A */ ] }
                }
              ]
            }
          },
          {
            weekNo: 2,
            workoutTemplates: {
              create: [
                { dayNo: 1, name: 'Workout B', exerciseSlots: { create: [ /* same as Day 2 Workout B */ ] } },
                { dayNo: 2, name: 'Workout A', exerciseSlots: { create: [ /* same as Day 1 Workout A */ ] } },
                { dayNo: 3, name: 'Workout B', exerciseSlots: { create: [ /* same as Day 2 Workout B */ ] } }
              ]
            }
          },
          // ... weekTemplates 3, 5, 7, 9, 11 (same pattern as Week 1: A-B-A)
          // ... weekTemplates 4, 6, 8, 10, 12 (same pattern as Week 2: B-A-B)
        ]
      }
    }
  });

  // Program 5: Upper/Lower DUP 4-Day
  await prisma.programTemplate.create({
    data: {
      name: 'Upper/Lower DUP 4-Day',
      daysPerWeek: 4,
      length: 8,
      autoRegulated: false,
      isPublic: true,
      weekTemplates: {
        create: [
          {
            weekNo: 1,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Upper Heavy',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Bent-Over Row' } }, targetSets: 4 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Barbell Curl' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 2,
                  name: 'Lower Heavy',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Deadlift' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Standing Calf Raise' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 3,
                  name: 'Upper Volume',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Overhead Press' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Lat Pulldown' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Dumbbell Lateral Raise' } }, targetSets: 3 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Triceps Pushdown' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 4,
                  name: 'Lower Volume',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Leg Press' } }, targetSets: 3 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Romanian Deadlift' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Leg Curl' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Leg Extension' } }, targetSets: 3 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Seated Calf Raise' } }, targetSets: 3 }
                    ]
                  }
                }
              ]
            }
          },
          // ... weekTemplates 2, 3, 4 (identical to Week 1 structure)
          {
            weekNo: 5,
            workoutTemplates: {
              create: [
                {
                  dayNo: 1,
                  name: 'Upper Heavy',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 5 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Bent-Over Row' } }, targetSets: 5 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Barbell Curl' } }, targetSets: 2 }
                    ]
                  }
                },
                {
                  dayNo: 2,
                  name: 'Lower Heavy',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Back Squat' } }, targetSets: 5 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Barbell Deadlift' } }, targetSets: 4 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Standing Calf Raise' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 3,
                  name: 'Upper Volume',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Barbell Overhead Press' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Lat Pulldown' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Barbell Bench Press' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Dumbbell Lateral Raise' } }, targetSets: 3 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Triceps Pushdown' } }, targetSets: 3 }
                    ]
                  }
                },
                {
                  dayNo: 4,
                  name: 'Lower Volume',
                  exerciseSlots: {
                    create: [
                      { order: 1, exerciseTemplate: { connect: { name: 'Leg Press' } }, targetSets: 4 },
                      { order: 2, exerciseTemplate: { connect: { name: 'Romanian Deadlift' } }, targetSets: 3 },
                      { order: 3, exerciseTemplate: { connect: { name: 'Leg Curl' } }, targetSets: 3 },
                      { order: 4, exerciseTemplate: { connect: { name: 'Leg Extension' } }, targetSets: 3 },
                      { order: 5, exerciseTemplate: { connect: { name: 'Seated Calf Raise' } }, targetSets: 3 }
                    ]
                  }
                }
              ]
            }
          }
          // ... weekTemplates 6, 7, 8 (identical to Week 5 structure)
        ]
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
