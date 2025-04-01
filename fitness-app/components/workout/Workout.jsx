import Exercise from "./Exercise";
import FeedbackForm from "./FeedbackForm"

export default function Workout({ workout, setProgram, program, setCurrentWorkout, viewonly }) {
  
  return (
    // Removed gap-4 from container class
    <div className="w-full mx-auto flex flex-col">
      {workout?.exercises?.map((exercise, index) => {
        // Get the previous exercise to compare muscles
        const previousExercise = index > 0 ? workout.exercises[index - 1] : null;
        // If it's the first exercise or the previous exercise has a different muscle, apply a top margin.
        const marginTop = !previousExercise || previousExercise.muscle !== exercise.muscle ? '1rem' : '0';
        const borderTop = !previousExercise || previousExercise.muscle !== exercise.muscle
        return (
          <div key={index} style={{ marginTop }} className={`${borderTop ? 'border-t border-[black]/20' : ''}`}>
            <Exercise 
              exercise={exercise}
              setProgram={setProgram}
              program={program}
              workout={workout}
              viewonly={viewonly}
            />
          </div>
        );
      })}

      {workout?.programmed && (
        <FeedbackForm 
          program={program}
          setCurrentWorkout={setCurrentWorkout}
          workout={workout}
          setProgram={setProgram}
        />
      )}

    </div>
  );
}
