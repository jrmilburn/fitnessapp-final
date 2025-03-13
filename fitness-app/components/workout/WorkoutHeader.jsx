import { useEffect, useState } from "react";
import ChangeWorkout from "./ChangeWorkout"

export default function WorkoutHeader({ program, currentWorkout, setCurrentWorkout }){

    const [firstWeekWithIncompleteSet, setFirstWeekWithIncompleteSet] = useState(null);

      useEffect(() => {

        const newWeek = program?.weeks.find(week =>
            week.workouts.some(workout =>
              workout.exercises.some(exercise =>
                exercise.sets.some(set => !set.complete)
              )
            )
          );

          setFirstWeekWithIncompleteSet(newWeek);

      }, [currentWorkout])
      

    return (
        <div className="w-full bg-[var(--secondary-bg)] flex justify-between p-4">

            <div className="flex flex-col">
                <h6>Week {firstWeekWithIncompleteSet?.weekNo}, {currentWorkout?.name}</h6>
                <p className="opacity-50">{program?.name}</p>
            </div>

            <div className="flex flex-col">
                <ChangeWorkout 
                    program={program}
                    setCurrentWorkout={setCurrentWorkout}
                />
            </div>

        </div>
    )

}