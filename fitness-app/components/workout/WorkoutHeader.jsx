import { useEffect, useState } from "react";
import ChangeWorkout from "./ChangeWorkout";
import Image from "next/image";
import ScrollUp from "../library/ScrollUp";
import ExerciseSearch from "../new/ExerciseSearch";

export default function WorkoutHeader({ program, currentWorkout, setCurrentWorkout, setProgram }) {
  // Renamed state for clarity
  const [currentWorkoutWeek, setCurrentWorkoutWeek] = useState(null);
  const [headerModalShown, setHeaderModalShown] = useState(false);
  const [addExerciseShown, setAddExerciseShown] = useState(false);

  useEffect(() => {
    if (program && currentWorkout) {
      // Find the week that contains the current workout based on a unique identifier (e.g., workoutNo)
      const week = program.weeks.find(week =>
        week.workouts.some(workout => workout.id === currentWorkout.id)
      );
      setCurrentWorkoutWeek(week);
    }
  }, [program, currentWorkout]);

  const addExercise = async (newExercise) => {

    const response = await fetch('/api/exercise', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({
        name: newExercise.name,
        muscle: newExercise.muscle,
        workoutId: currentWorkout.id
      })
    });

    if (response.ok) {
      const data = await response.json();
      setProgram(data.program);
    }

  }

  return (
    <div className="w-full bg-[var(--secondary-bg)] flex justify-between p-4">
      <div className="flex flex-col">
        <h6>
          Week {currentWorkoutWeek?.weekNo}, {currentWorkout?.name}
        </h6>
        <p className="opacity-50">{program?.name}</p>
      </div>

      <div className="flex flex-col gap-2">
        <ChangeWorkout 
          program={program}
          setCurrentWorkout={setCurrentWorkout}
        />
        <button className="cursor-pointer" onClick={() => setHeaderModalShown(true)}>
          <Image 
            width={32}
            height={32}
            src="/icons/hori-dots.svg"
            alt="more"
          />
        </button>
      </div>
          <ScrollUp 
            modalShown={headerModalShown}
            setModalShown={setHeaderModalShown}
          >
      
          <div className="w-full flex flex-col items-center gap-4">
            <button className="px-4 py-2 bg-[green]/70 text-white rounded-lg cursor-pointer"
              onClick={() => {
                setAddExerciseShown(true);
              }}
            >
              AddExercise
            </button>
          </div>
      
              <ScrollUp
                modalShown={addExerciseShown}
                setModalShown={setAddExerciseShown}
                left={false}
              >
                <ExerciseSearch
      
                  newExercise={addExercise}
                  setShown={(state) => {
                    setAddExerciseShown(state);
                    setHeaderModalShown(state);
                  }}
      
                />
              </ScrollUp>
      
          </ScrollUp>
    </div>
  );
}
