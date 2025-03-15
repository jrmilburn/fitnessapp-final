import WorkoutStructure from "./WorkoutStructure";
import ConfirmationModal from "../library/ConfirmationModal"

import { useState } from "react";
import Image from "next/image";

export default function WeekLayout({ weekLayout, setWeekLayout }) {

  const [weekNo, setWeekNo] = useState(0);

  const onConfirm = () => {

    setWeekLayout((prevWeekLayout) => {
      console.log("Before copying, prevWeekLayout:", prevWeekLayout);
      const currentWeek = prevWeekLayout[weekNo];
      if (!currentWeek) {
        console.error(`Week number ${weekNo} not found in weekLayout`);
        return prevWeekLayout;
      }
      // Create a new layout by copying currentWeek.workouts to every other week
      const newLayout = prevWeekLayout.map((week, index) => {
        if (index === weekNo) {
          return week;
        } else {
          const copiedWorkouts = currentWeek.workouts.map((workout) => ({
            ...workout,
            // Create a new array for exercises so future changes don't conflict
            exercises: [...workout.exercises],
          }));
          return {
            ...week,
            workouts: copiedWorkouts,
          };
        }
      });
      console.log("After copying, newLayout:", newLayout);
      return newLayout;
    });

  }

  const onCancel = () => {

  }

  return (
    <>
    {weekLayout && (
      <div className="w-full bg-[var(--secondary-bg)] p-4 h-full flex flex-col items-center">
        <div className="flex justify-around mb-8 w-full">
          {weekLayout.map((week, index) => (
            <div key={index} className="flex gap-2 items-center">
            <button className={`px-4 py-2 cursor-pointer border border-black/20 ${weekNo === index ? 'bg-[black]/10' : ''}`} onClick={() => setWeekNo(index)}>
              Week {week.weekNo}
            </button>
            <ConfirmationModal
              title="Copy Program"
              message="Are you sure you want to copy this weeks structure to all other weeks? This will overwrite any existing structure"
              onConfirm={onConfirm}
              onCancel={onCancel}
            >
              <Image 
                src="/icons/copy.svg"
                width={28}
                height={28}
                alt="copy"
              />
            </ConfirmationModal>
            </div>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {weekLayout[weekNo]?.workouts?.map((workout, index) => (
            <WorkoutStructure 
              key={index + 100}
              workout={workout}
              weekNo={weekNo}
              setWeekLayout={setWeekLayout}
            />
          ))}
        </div>
      </div>
    )}
    </>
  );
}
