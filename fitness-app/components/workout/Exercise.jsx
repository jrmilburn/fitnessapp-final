import Set from "./Set";
import { useEffect, useState } from "react";
import Image from "next/image";

import ScrollUp from "../library/ScrollUp"
import ExerciseSearch from "../new/ExerciseSearch";

export default function Exercise({ exercise, setProgram, program, workout }) {

  //State used for tracking the users first input
  const [firstInput, setFirstInput] = useState(false);

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

  const updateAllExercises = async (newExercise) => {

    const response = await fetch('/api/exercise', {
      method: 'PUT',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({
        name: newExercise.name,
        muscle: newExercise.muscle,
        workoutId: newExercise.id,
        all: true
      })
    })

    if(response.ok) {

    }

  }


  return (
    <>
    <div className={`bg-[var(--primary-bg)] p-4 w-full border-2 ${(isExerciseComplete && workout.programmed) ? 'border-[var(--accent)]' : 'border-black/0'}`}>
      <div className="flex justify-between">
      <div className="relative">
        <h6>{exercise?.name}</h6>
        <p className="opacity-[0.5]">{exercise?.muscle}</p>
      </div>
      {workout.programmed && (
        <button className="cursor-pointer" onClick={toggleModal}>
          <Image 
            src="/icons/hori-dots.svg"
            width={32}
            height={32}
            alt="more"
          />
        </button>
      )}
      </div>

      {workout.programmed ? (
        <div className="mt-4 flex flex-col gap-2 w-full">
          <div className="flex w-full justify-around">
            <p>Weight</p>
            <p className="-translate-x-[50%]">Reps</p>
          </div>
          {exercise?.sets
            ?.slice()
            .sort((a, b) => a.setNo - b.setNo)
            .map(set => (
              <Set 
                key={set.id}
                set={set}
                setProgram={setProgram}
                exerciseId={exercise.id}
              />
            ))
          }

        </div>        
      ) : (
        <div className="mt-4 flex flex-col gap-2 w-full">
        <div className="flex w-full justify-around">
          <p className="opacity-50">Sets not programmed for this exercise yet. Complete previous workouts to update sets.</p>
        </div>
        </div>   
      )}

    </div>

    <ScrollUp 
      modalShown={workoutsModalShown}
      setModalShown={setWorkoutsModalShown}
    >

    <div className="w-full flex flex-col items-center gap-4">
      <button className="px-4 py-2 bg-[green]/70 text-white rounded-lg cursor-pointer"
        onClick={() => {
          updateAllExercises();
          setModalShown(false);
        }}
      >
        Update Exercise
      </button>
      <button className="px-4 py-2 bg-[red]/70 text-white rounded-lg cursor-pointer" 
        onClick={() => {
          removeSet();
          setModalShown(false);
        }}>
        Delete Excercise
      </button>
    </div>

      <ExerciseSearch

      />

    </ScrollUp>

    </>
  );
}
