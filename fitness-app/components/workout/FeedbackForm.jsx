import { useEffect, useState } from "react";
import ScrollUp from "../library/ScrollUp";
import NextWorkout from "./NextWorkout";
import Button from "../library/Button";

export default function FeedbackForm({ program, currentWorkoutState, setCurrentWorkout, workout }) {
  // Find the current workout from the program data
  const currentWorkout = program?.weeks
    ?.flatMap(week => week.workouts)
    .find(w => w.id === workout?.id);    

  // Determine if all exercises in the workout are complete
  const isWorkoutComplete = currentWorkout?.exercises?.every(exercise =>
    exercise?.sets.every(set => set.complete)
  );

  const [formShown, setFormShown] = useState(false);

  // This state holds the feedback data:
  // muscles: an object keyed by muscle name with ratings for workload, jointpain, and soreness
  // overallFatigue: a single rating value (1-10)
  const [feedbackData, setFeedbackData] = useState({
    muscles: {},
    overallFatigue: ""
  });

  // When the currentWorkout is available, initialize feedback entries for each unique muscle.
  useEffect(() => {
    if (currentWorkout && currentWorkout.exercises) {
      const uniqueMuscles = Array.from(new Set(currentWorkout.exercises.map(e => e.muscle)));
      const musclesFeedback = {};
      uniqueMuscles.forEach(muscle => {
        musclesFeedback[muscle] = { workload: "", jointpain: "", soreness: "" };
      });
      setFeedbackData(prev => ({ ...prev, muscles: musclesFeedback }));
    }
  }, [currentWorkout]);

  useEffect(() => {
    setFormShown(isWorkoutComplete);
  }, [isWorkoutComplete]);

  // Handler to update feedback for a given muscle and field
  const handleMuscleFeedbackChange = (muscle, field, value) => {
    setFeedbackData(prev => ({
      ...prev,
      muscles: {
        ...prev.muscles,
        [muscle]: {
          ...prev.muscles[muscle],
          [field]: value,
        },
      },
    }));
  };

  // Handler for overall fatigue rating
  const handleOverallFatigueChange = (value) => {
    setFeedbackData(prev => ({
      ...prev,
      overallFatigue: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting feedback:", feedbackData);
    // Here you can send the data to your backend/API for processing/storing.
  };

  // Render radio button inputs for a 1-10 scale for a given muscle and field.
  const renderRatingInputs = (muscle, field) => {
    const currentValue = feedbackData.muscles[muscle]?.[field] || "";
    return (
      <div className="flex space-x-2">
        {Array.from({ length: 5 }, (_, i) => i + 1).map(value => (
          <label key={value} className="flex flex-col items-center">
            <input
              type="radio"
              name={`${muscle}-${field}`}
              value={value}
              checked={Number(currentValue) === value}
              onChange={(e) => handleMuscleFeedbackChange(muscle, field, Number(e.target.value))}
              className="appearance-none w-16 h-12 border border-gray-300 rounded cursor-pointer checked:bg-[var(--accent)] checked:border-blue-500 focus:outline-none"
            />
            <span>{value}</span>
          </label>
        ))}
      </div>
    );
  };

  // Render overall fatigue inputs using the same scale.
  const renderOverallFatigue = () => {
    const currentValue = feedbackData.overallFatigue || "";
    return (
        <div className="w-full flex justify-center">
      <div className="flex space-x-2">
        {Array.from({ length: 5 }, (_, i) => i + 1).map(value => (
          <label key={value} className="flex flex-col items-center">
            <input
              type="radio"
              name="overallFatigue"
              value={value}
              checked={Number(currentValue) === value}
              onChange={(e) => handleOverallFatigueChange(Number(e.target.value))}
              className="appearance-none w-16 h-12 border border-gray-300 rounded cursor-pointer checked:bg-[var(--accent)] checked:border-blue-500 focus:outline-none"
            />
            <span>{value}</span>
          </label>
        ))}
      </div>
      </div>
    );
  };

  return (
    <>

    <div className="w-full flex justify-center mt-6">
    <Button 
        type="button"
        text="Submit"
        onClick={() => setFormShown(true)}
    />
    </div>

    <ScrollUp modalShown={formShown} setModalShown={setFormShown}>
      <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-between">
        <div className="overflow-auto mx-12">
          {currentWorkout && currentWorkout.exercises && (
            <>
              <h2 className="text-xl mb-4">Workout Feedback</h2>
              {Array.from(new Set(currentWorkout.exercises.map(e => e.muscle))).map(muscle => (
                <div key={muscle} className="border-b border-black/20 p-2">
                  <h6 className="opacity-50 mb-4">{muscle}</h6>
                  <div className="mb-2 flex justify-between">
                    <label className="block font-semibold">Workload:</label>
                    {renderRatingInputs(muscle, "workload")}
                  </div>
                  <div className="mb-2 flex justify-between">
                    <label className="block font-semibold">Joint Pain:</label>
                    {renderRatingInputs(muscle, "jointpain")}
                  </div>
                  <div className="mb-2 flex justify-between">
                    <label className="block font-semibold">Soreness:</label>
                    {renderRatingInputs(muscle, "soreness")}
                  </div>
                </div>
              ))}
              <div className="mb-6 border-b border-black/20 p-2">
                <h6 className="opacity-50 mb-4">Overall Fatigue</h6>
                {renderOverallFatigue()}
              </div>
            </>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mx-12">
          Submit Feedback
        </button>
      </form>
    </ScrollUp>
    </>
  );
}
