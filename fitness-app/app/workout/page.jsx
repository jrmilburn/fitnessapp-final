"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react";

import Workout from "@/components/workout/Workout";
import WorkoutHeader from "@/components/workout/WorkoutHeader";

export default function Dashboard() {

    const { data: session } = useSession();
    const [program, setProgram] = useState(null);
    const [currentWorkout, setCurrentWorkout] = useState(null);

    const program1 = {
        userId: "1",
        name: "Program 1",
        weeks: [
            {
                weekNo: 1,
                workouts: [
                    {
                        name: "1",
                        workoutNo: 1,
                        exercises: [
                            {
                                name: "Squat",
                                sets: [
                                    {
                                        setNo: 1,
                                        reps: 0,
                                        weight: 0,
                                        complete: false
                                    },                            {
                                        setNo: 2,
                                        reps: 0,
                                        weight: 0,
                                        complete: false
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "2",
                        workoutNo: 2,
                        exercises: [
                            {
                                name: "Lateral raise",
                                sets: [
                                    {
                                        setNo: 1,
                                        reps: 0,
                                        weight: 0,
                                        complete: false
                                    },                            
                                    {
                                        setNo: 2,
                                        reps: 0,
                                        weight: 0,
                                        complete: false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                weekNo: 2,
                workouts: [
                    {
                        name: "1",
                        workoutNo: 1,
                        exercises: [
                            {
                                name: "Bench Press",
                                sets: [
                                    {
                                        setNo: 1,
                                        reps: 0,
                                        weight: 0,
                                        complete: false
                                    },                            {
                                        setNo: 2,
                                        reps: 0,
                                        weight: 0,
                                        complete: false
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "2",
                        workoutNo: 2,
                        exercises: [
                            {
                                name: "Lateral raise",
                                sets: [
                                    {
                                        setNo: 1,
                                        reps: 0,
                                        weight: 0,
                                        complete: false
                                    },                            
                                    {
                                        setNo: 2,
                                        reps: 0,
                                        weight: 0,
                                        complete: false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ]
    }

    useEffect(() => {
        setProgram(program1);
        setCurrentWorkout(program1?.weeks[0]?.workouts[0]);
    }, [])

    return (
        <div className="max-w-[calc(100% - 16rem)] ml-64 min-h-screen flex flex-col gap-4 justify-start items-center p-4 relative">
            <div className="max-w-2xl mx-auto w-full flex flex-col">
            <WorkoutHeader 
                program={program}
                currentWorkout={currentWorkout}
                setCurrentWorkout={setCurrentWorkout}
            />
            <Workout 
                workout={currentWorkout}
            />
            </div>
        </div>
    )

}