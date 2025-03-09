"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react";

import Workout from "../../components/workout/Workout";
import WorkoutHeader from "../../components/workout/WorkoutHeader";

export default function Dashboard() {

    const { data: session } = useSession();
    const [program, setProgram] = useState(null);
    const [currentWorkout, setCurrentWorkout] = useState(null);

    useEffect(() => {
        fetch('/data/program.json')
        .then(response => response.json())
        .then(data => {
            setProgram(data)
            setCurrentWorkout(data?.weeks[0]?.workouts[0]);
        })
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
                setProgram={setProgram}
                program={program}
                setCurrentWorkout={setCurrentWorkout}
                currentWorkoutState={currentWorkout}
            />
            </div>
        </div>
    )

}