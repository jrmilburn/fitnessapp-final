import Set from "./Set";
import { useEffect, useState } from "react";
import Image from "next/image";

import ScrollUp from "../library/ScrollUp"

export default function Exercise({ exercise, setProgram, program }) {

  const currentExercise = program?.weeks
    .flatMap(week => week.workouts)
    .flatMap(workout => workout.exercises)
    .find(ex => ex.id === exercise.id);

  const isExerciseComplete = currentExercise?.sets?.every(set => set.complete);

  const[workoutsModalShown, setWorkoutsModalShown] = useState(false);

  const toggleModal = () => {

    const newState = !workoutsModalShown;

    setWorkoutsModalShown(newState);

  }


  return (
    <>
    <div className={`bg-[var(--secondary-bg)] p-4 w-full border-2 ${isExerciseComplete ? 'border-[var(--accent)]' : 'border-black/0'}`}>
      <div className="flex justify-between">
      <div className="relative">
        <h6>{exercise?.name}</h6>
        <p className="opacity-[0.5]">{exercise?.muscle}</p>
      </div>
      <button className="cursor-pointer" onClick={toggleModal}>
        <Image 
          src="/icons/hori-dots.svg"
          width={32}
          height={32}
          alt="more"
        />
      </button>
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

    <ScrollUp 
      modalShown={workoutsModalShown}
      setModalShown={setWorkoutsModalShown}
    >

    </ScrollUp>

    </>
  );
}
