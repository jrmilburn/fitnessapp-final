import Exercise from "./Exercise";
import NextWorkout from "./NextWorkout";

export default function Workout({ workout, setProgram, program, setCurrentWorkout, currentWorkoutState }) {
  const currentWorkout = program?.weeks
    ?.flatMap(week => week.workouts)
    .find(w => w.id === workout?.id);    

  const isWorkoutComplete = currentWorkout?.exercises?.every(exercise =>
    exercise?.sets.every(set => set.complete)
  );
  
  return (
    // Removed gap-4 from container class
    <div className="w-full mx-auto flex flex-col">
      {workout?.exercises?.map((exercise, index) => {
        // Get the previous exercise to compare muscles
        const previousExercise = index > 0 ? workout.exercises[index - 1] : null;
        // If it's the first exercise or the previous exercise has a different muscle, apply a top margin.
        const marginTop = !previousExercise || previousExercise.muscle !== exercise.muscle ? '1rem' : '0';
        return (
          <div key={index} style={{ marginTop }}>
            <Exercise 
              exercise={exercise}
              setProgram={setProgram}
              program={program}
            />
          </div>
        );
      })}

      {isWorkoutComplete && (
        <NextWorkout 
          program={program}
          currentWorkoutState={currentWorkoutState}
          setCurrentWorkout={setCurrentWorkout}
        />
      )}
    </div>
  );
}
