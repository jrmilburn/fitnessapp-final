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
        <div className="w-full bg-[var(--primary-bg)] p-4 h-full flex flex-col items-center shadow-md rounded-lg border border-[black]/5">
          {/* Render the week selector only if not autoRegulated */}
          {!autoRegulated && (
            <div className="flex gap-8 mb-8 w-full justify-center items-center">
              <div className="flex flex-wrap gap-8 justify-center">
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
                </div>
              ))}
              </div>
              <div className="w-16 h-16">
                <ConfirmationModal
                  title="Copy Program"
                  message={`Are you sure you want to copy week ${weekNo + 1}'s structure to all other weeks? This will overwrite any existing structure`}
                  onConfirm={onConfirm}
                  onCancel={onCancel}
                >
                  <Image src="/icons/copy.svg" width={28} height={28} alt="copy" />
                </ConfirmationModal>
                </div>
            </div>
          )}
          {/* Render workouts for the currentWeek */}
          <div className="w-full  overflow-x-auto p-4">
          <div className="flex gap-2">
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
        </div>
      )}
    </>
  );
}
