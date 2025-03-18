import Button from "../library/Button";

export default function NextWorkout({ program, setCurrentWorkout, handleSubmit }) {
  
    const allSetsComplete = program?.weeks
        .flatMap(week => week.workouts)
        .flatMap(workout => workout.exercises)
        .every(exercise =>
          exercise.sets.every(set => set.complete)
    );
    
    const nextWorkout = async (e) => {

      const response = await handleSubmit(e);

    if (allSetsComplete) {
      
      return;
    }

    if(response.ok) {
      const nextWorkoutWithIncompleteSet = program.weeks
      .flatMap(week => week.workouts)
      .find(workout =>
        workout.exercises.some(exercise =>
          exercise.sets.some(set => !set.complete)
        )
      );
    
      setCurrentWorkout(nextWorkoutWithIncompleteSet);
    }

    return
  
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
