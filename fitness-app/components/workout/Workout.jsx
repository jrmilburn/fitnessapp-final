import Exercise from "./Exercise"
import NextWorkout from "./NextWorkout";

export default function Workout({ workout, setProgram, program, setCurrentWorkout, currentWorkoutState }) {

    const currentWorkout = program?.weeks
    .flatMap(week => week.workouts)
    .find(w => w.id === workout.id);    

    const isWorkoutComplete = currentWorkout?.exercises?.every(exercise =>
        exercise?.sets.every(set => set.complete)
      );
      

    return (
        <div className={`w-full mx-auto flex flex-col gap-4 items-center`}>
            {workout?.exercises?.map((exercise, index) => {
                return (
                    <Exercise 
                        key={index}
                        exercise={exercise}
                        setProgram={setProgram}
                        program={program}
                    />
                )
            })}

            {isWorkoutComplete &&
                (
                <NextWorkout 
                    program={program}
                    currentWorkoutState={currentWorkoutState}
                    setCurrentWorkout={setCurrentWorkout}
                />
            )
            }
        </div>
    )

}