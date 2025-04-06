"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // or "next/navigation" if you're using Next.js 13
import Workout from "../../components/workout/Workout";
import WorkoutHeader from "../../components/workout/WorkoutHeader";

export default function WorkoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [program, setProgram] = useState(null);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [feedbackShown, setFeedbackShown] = useState(false);

  useEffect(() => {
    fetch("/api/program")
      .then((response) => response.json())
      .then((data) => {
        // If there's no program (or weeks) then redirect to "/new"
        if (!data || !data.weeks || data.weeks.length === 0) {
          router.push("/new");
          return;
        }

        const nextWorkoutWithIncompleteSet = data.weeks
          .flatMap((week) => week.workouts)
          .find((workout) =>
            workout.exercises.some((exercise) =>
              exercise.sets.some((set) => !set.complete)
            )
          );

        setProgram(data);
        setCurrentWorkout(nextWorkoutWithIncompleteSet);
      })
      .catch((error) => {
        console.error("Error fetching program:", error);
        router.push('/new');
      });
  }, [router]);

  useEffect(() => {
    if (program) {
      let updatedWorkout = null;

      // If there's already a current workout, try to find its updated version in the program.
      if (currentWorkout) {
        updatedWorkout = program.weeks
          .flatMap((week) => week.workouts)
          .find((workout) => workout.id === currentWorkout.id);
      }

      // If not found, compute the next workout with an incomplete set.
      if (!updatedWorkout) {
        updatedWorkout = program.weeks
          .flatMap((week) => week.workouts)
          .find((workout) =>
            workout.exercises.some((exercise) =>
              exercise.sets.some((set) => !set.complete)
            )
          );
      }

      setCurrentWorkout(updatedWorkout);
    }
  }, [program, currentWorkout?.id]);

  return (
    <div className="w-full min-h-screen flex flex-col gap-4 justify-start items-center p-4 relative">
      <div className="max-w-2xl mx-auto w-full flex flex-col">
        { program && 
        (
        <WorkoutHeader
          program={program}
          setProgram={setProgram}
          currentWorkout={currentWorkout}
          setCurrentWorkout={setCurrentWorkout}
          viewonly={false}
        />
      )
        }
        <Workout
          workout={currentWorkout}
          setProgram={setProgram}
          program={program}
          setCurrentWorkout={setCurrentWorkout}
          viewonly={false}
        />
      </div>
    </div>
  );
}
