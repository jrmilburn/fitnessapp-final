import Image from "next/image";
import { useState } from "react";

export default function ExerciseStructure({ 
  exercise, 
  onDelete, 
  setWeekLayout, 
  autoRegulated,
  weekIndex,     // index of the week in weekLayout
  workoutIndex,  // index of the workout in the current week
  exerciseIndex  // index of the exercise in the workout's exercises array
}) {
  const [setCount, setSetCount] = useState(exercise.sets.length);

  const incrementSets = () => {
    // Update the parent weekLayout state by incrementing the sets for the correct exercise
    setWeekLayout((prevWeekLayout) => {
      return prevWeekLayout.map((week, wIdx) => {
        // Only update the week at weekIndex
        if (wIdx !== weekIndex) return week;
        return {
          ...week,
          workouts: week.workouts.map((workout, wkIdx) => {
            // Only update the workout at workoutIndex
            if (wkIdx !== workoutIndex) return workout;
            return {
              ...workout,
              exercises: workout.exercises.map((ex, exIdx) => {
                // Only update the exercise at exerciseIndex
                if (exIdx !== exerciseIndex) return ex;
                // Add a new set with an incremented set number
                return {
                  ...ex,
                  sets: [...ex.sets, { setNo: ex.sets.length + 1 }]
                };
              })
            };
          })
        };
      });
    });
    // Update local state for immediate UI feedback
    setSetCount((prev) => prev + 1);
  };

  // Similar logic can be implemented for decrementSets if needed

  return (
    <div className="w-full bg-[var(--primary-bg)] p-2 relative overflow-x-none z-20 cursor-pointer ">
      <p>{exercise.name}</p>
      <p className="opacity-[0.5]">{exercise.muscle}</p>
      
      {!autoRegulated && (
        <div className="w-full flex items-center gap-4">
          <div>Sets: {setCount}</div>
          <div className="flex flex-col items-center gap-1">
            <button 
              className="bg-[var(--accent)] text-white p-2 w-8 cursor-pointer" 
              onClick={incrementSets}
            >
              +
            </button>
            <button className="bg-[var(--accent)] text-white p-2 w-8 cursor-pointer">
              -
            </button>
          </div>
        </div>
      )}
      <button className="absolute top-0 right-0 cursor-pointer" onClick={onDelete}>
        <Image 
          src="/icons/close.svg"
          width={28}
          height={28}
          alt="close icon"
        />
      </button>
      <div className="w-full bg-black/20 h-[1px] my-2"></div>
    </div>
  );
}
