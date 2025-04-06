"use client"

import { useState, useEffect } from "react";

import Workout from "../../components/workout/Workout";
import WorkoutHeader from "../../components/workout/WorkoutHeader";

export default function WorkoutView({ initProgram }) {

    const [program, setProgram] = useState(initProgram);
    const [currentWorkout, setCurrentWorkout] = useState(null);

    useEffect(() => {
        setProgram(initProgram)
        setCurrentWorkout(initProgram?.weeks[0]?.workouts[0]);
    }, [])
    

    return (
        <div className="flex flex-col gap-4 justify-start items-center relative">
            <div className="max-w-2xl mx-auto w-full flex flex-col">
            <WorkoutHeader 
                program={program}
                currentWorkout={currentWorkout}
                setCurrentWorkout={setCurrentWorkout}
                viewonly={true}
            />
            <Workout 
                workout={currentWorkout}
                setProgram={setProgram}
                program={program}
                setCurrentWorkout={setCurrentWorkout}
                currentWorkoutState={currentWorkout}
                viewonly={true}
            />
            </div>
        </div>
    )

}