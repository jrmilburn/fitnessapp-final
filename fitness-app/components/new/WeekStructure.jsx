import { useState } from "react";

import ConfirmationModal from "../library/ConfirmationModal"
import WorkoutStructure from "../new/WorkoutStructure"
import Image from "next/image";

export default function WeekLayout({ weekLayout, setWeekLayout, autoRegulated }) {
  const [weekNo, setWeekNo] = useState(0);

  const onConfirm = () => {
    setWeekLayout((prevWeekLayout) => {
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
      return newLayout;
    });
  };

  const onCancel = () => {
    // Your cancel logic here if needed
  };

  let currentWeek;

  if(weekLayout) {
    currentWeek = autoRegulated ? weekLayout[0] : weekLayout[weekNo];
  }

  return (
    <>
      {weekLayout && (
        <div className="w-full bg-[var(--secondary-bg)] p-4 h-full flex flex-col items-center">
          {/* Render the week selector only if not autoRegulated */}
          {!autoRegulated && (
            <div className="flex justify-around mb-8 w-full">
              {weekLayout.map((week, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <button
                    className={`px-4 py-2 cursor-pointer border border-black/20 ${
                      weekNo === index ? "bg-[black]/10" : ""
                    }`}
                    onClick={() => setWeekNo(index)}
                  >
                    Week {week.weekNo}
                  </button>
                  <ConfirmationModal
                    title="Copy Program"
                    message="Are you sure you want to copy this week's structure to all other weeks? This will overwrite any existing structure"
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                  >
                    <Image src="/icons/copy.svg" width={28} height={28} alt="copy" />
                  </ConfirmationModal>
                </div>
              ))}
            </div>
          )}
          {/* Render workouts for the currentWeek */}
          <div className="flex gap-2 overflow-x-auto">
            {currentWeek?.workouts?.map((workout, index) => (
              <WorkoutStructure
                key={index + 100}
                workout={workout}
                weekNo={autoRegulated ? 0 : weekNo} // If autoRegulated, you can simply pass 0 or adjust as needed.
                setWeekLayout={setWeekLayout}
                autoRegulated={autoRegulated}
                workoutIndex={index}
                weekIndex={weekNo}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
