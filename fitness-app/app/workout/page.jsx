"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react";

import Workout from "../../components/workout/Workout";
import WorkoutHeader from "../../components/workout/WorkoutHeader";

export default function WorkoutPage() {

    const { data: session } = useSession();
    const [program, setProgram] = useState(null);
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [feedbackShown, setFeedbackShown] = useState(false);

    useEffect(() => {
        fetch('/api/program')
        .then(response => response.json())
        .then(data => {

            const nextWorkoutWithIncompleteSet = data?.weeks
            .flatMap(week => week.workouts)
            .find(workout =>
              workout.exercises.some(exercise =>
                exercise.sets.some(set => !set.complete)
              )
            );

            setProgram(data)
            setCurrentWorkout(nextWorkoutWithIncompleteSet);
            console.log(data);
        })
    }, [])

    useEffect(() => {
        if (program) {
          let updatedWorkout = null;
          
          // If there's already a current workout, try to find its updated version in the program.
          if (currentWorkout) {
            updatedWorkout = program.weeks
              .flatMap(week => week.workouts)
              .find(workout => workout.id === currentWorkout.id);
          }
          
          // If not found, compute the next workout with an incomplete set.
          if (!updatedWorkout) {
            updatedWorkout = program.weeks
              .flatMap(week => week.workouts)
              .find(workout =>
                workout.exercises.some(exercise =>
                  exercise.sets.some(set => !set.complete)
                )
              );
          }
          
          setCurrentWorkout(updatedWorkout);
        }
      }, [program, currentWorkout?.id]);
      
    

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
            />
            </div>
        </div>
    )

}