import Button from "../library/Button";

export default function NextWorkout({ program, setCurrentWorkout }) {
  
    const allSetsComplete = program.weeks
        .flatMap(week => week.workouts)
        .flatMap(workout => workout.exercises)
        .every(exercise =>
          exercise.sets.every(set => set.complete)
    );
    
    const nextWorkout = () => {

    if (allSetsComplete) {
      
      return;
    }

    const nextWorkoutWithIncompleteSet = program.weeks
    .flatMap(week => week.workouts)
    .find(workout =>
      workout.exercises.some(exercise =>
        exercise.sets.some(set => !set.complete)
      )
    );
  
    setCurrentWorkout(nextWorkoutWithIncompleteSet);
  
  };

  const finishProgram = () => {

    /**Finsih program logic */

  }

  return (
    <>
    {allSetsComplete ? (
    <Button 
        type="button"
        text="Finish Program"
        onClick={finishProgram}
      />
    ) : (
    <Button 
        type="button"
        text="Next Workout"
        onClick={nextWorkout}
      />
    )}
    </>
  );
}
