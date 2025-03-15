import { useEffect, useState } from "react";
import ChangeWorkout from "./ChangeWorkout";

export default function WorkoutHeader({ program, currentWorkout, setCurrentWorkout }) {
  // Renamed state for clarity
  const [currentWorkoutWeek, setCurrentWorkoutWeek] = useState(null);

  useEffect(() => {
    if (program && currentWorkout) {
      // Find the week that contains the current workout based on a unique identifier (e.g., workoutNo)
      const week = program.weeks.find(week =>
        week.workouts.some(workout => workout.id === currentWorkout.id)
      );
      setCurrentWorkoutWeek(week);
    }
  }, [program, currentWorkout]);

  return (
    <div className="w-full bg-[var(--secondary-bg)] flex justify-between p-4">
      <div className="flex flex-col">
        <h6>
          Week {currentWorkoutWeek?.weekNo}, {currentWorkout?.name}
        </h6>
        <p className="opacity-50">{program?.name}</p>
      </div>

      <div className="flex flex-col">
        <ChangeWorkout 
          program={program}
          setCurrentWorkout={setCurrentWorkout}
        />
      </div>
    </div>
  );
}
