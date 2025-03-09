import ExerciseSearch from "./ExerciseSearch";
import ExerciseStructure from "./ExerciseStructure";
import { useState } from "react";

export default function WorkoutStructure({ workout, setWeekLayout }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const newExercise = (exercise) => {
    setWeekLayout((prevWeekLayout) =>
      prevWeekLayout.map((w) =>
        w.workoutNo === workout.workoutNo
          ? { ...w, exercises: [...w.exercises, exercise] }
          : w
      )
    );
  };

  const updateWorkoutName = (e) => {
    const newName = e.target.value;
    setWeekLayout((prevWeekLayout) =>
      prevWeekLayout.map((w) =>
        w.workoutNo === workout.workoutNo ? { ...w, name: newName } : w
      )
    );
  };

  return (
    <>
      <div className="h-full min-w-[250px] bg-[var(--secondary-bg)] overflow-x-auto flex flex-col gap-2">
        <input
          value={workout.name}
          onChange={updateWorkoutName}
          className="border border-black/10 p-1"
        />
        {workout.exercises.map((exercise, index) => (
          <ExerciseStructure key={index} exercise={exercise} />
        ))}
        <button className="w-full bg-[var(--primary-bg)]" onClick={toggleModal}>
          Add New +
        </button>
      </div>

      <ExerciseSearch newExercise={newExercise} shown={showModal} setShown={setShowModal} />
    </>
  );
}
