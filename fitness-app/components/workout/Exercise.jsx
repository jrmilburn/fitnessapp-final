import Set from "./Set";
import { useEffect, useState } from "react";

export default function Exercise({ exercise, setProgram, program }) {

  const currentExercise = program?.weeks
    .flatMap(week => week.workouts)
    .flatMap(workout => workout.exercises)
    .find(ex => ex.name === exercise.name);

  const isExerciseComplete = currentExercise?.sets?.every(set => set.complete);


  return (
    <div className={`bg-[var(--secondary-bg)] p-4 w-full border-2 ${isExerciseComplete ? 'border-[var(--accent)]' : 'border-black/0'}`}>
      <div className="relative">
        <h6>{exercise?.name}</h6>
        <p className="opacity-[0.5]">{exercise?.muscle}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 w-full">
        <div className="flex w-full justify-around">
          <p>Weight</p>
          <p className="-translate-x-[50%]">Reps</p>
        </div>
        {exercise?.sets?.map(set => (
          <Set 
            key={set.id}
            set={set}
            setProgram={setProgram}
          />
        ))}
      </div>
    </div>
  );
}
