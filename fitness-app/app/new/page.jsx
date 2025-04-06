"use client"

import ProgramStructure from "../../components/new/ProgramStructure"
import WeekLayout from "../../components/new/WeekStructure";
import { useState, useEffect } from 'react';
import Button from "../../components/library/Button";
import { useRouter } from "next/navigation";

export default function NewPage() {

    const router = useRouter();

    /**state variables to be intialised */
    const [programStructure, setProgramStructure] = useState({
        name: "",
        comments: "",
        length: 4,
        days: 2,
    });
    const [weekLayout, setWeekLayout] = useState(null);
    const [autoRegulated, setAutoRegulated] = useState(false);

    const loadLayout = (e) => {
        e.preventDefault();
      
        const daysCount = programStructure.days;
        const weeksCount = programStructure.length;
      
        let workouts = [];
        let weeks = [];
      
        for (let i = 0; i < daysCount; i++) {
          workouts.push({
            name: "Day " + (i + 1),
            workoutNo: i + 1,
            exercises: [],
          });
        }
      
        // Create a separate copy of the workouts array for each week
        for (let i = 0; i < weeksCount; i++) {
          weeks.push({
            weekNo: i + 1,
            workouts: workouts
          });
        }

        setWeekLayout(weeks);
      };
      

      const createProgram = async () => {
        // Compute the final layout based on autoRegulated flag
        let finalWeekLayout = weekLayout;
        if (autoRegulated && weekLayout && weekLayout.length > 0) {
          const currentWeek = weekLayout.find(week => week.weekNo === 1);
          if (currentWeek) {
            finalWeekLayout = weekLayout.map((week) => ({
              ...currentWeek,
              weekNo: week.weekNo, // keep each week's original number
              workouts: currentWeek.workouts.map((workout) => ({
                ...workout,
                // Deep clone exercises to avoid shared references
                exercises: workout.exercises.map(exercise => ({ ...exercise }))
              }))
            }));
            // Update the state (if you still need to update it for the UI)
            setWeekLayout(finalWeekLayout);
          }
        }
      
        // Use finalWeekLayout in your fetch call
        const response = await fetch('/api/new-program', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weekLayout: finalWeekLayout,
            programStructure,
            autoRegulated
          })
        });
      
        if (response.ok) {
          router.push('/workout');
        }
      };
      
      

    return (
        <div className="flex gap-2 p-4">
            <div className="w-full h-full flex flex-col gap-4">
                <ProgramStructure 
                    programStructure={programStructure}
                    setProgramStructure={setProgramStructure}
                    loadLayout={loadLayout}
                    autoRegulated={autoRegulated}
                    setAutoRegulated={setAutoRegulated}
                />
                <WeekLayout 
                    weekLayout={weekLayout}
                    setWeekLayout={setWeekLayout}
                    autoRegulated={autoRegulated}
                />
                <div className="mx-auto w-48">
                <Button 
                    type="button"
                    text="Create"
                    onClick={createProgram}
                />
                </div>
            </div>
        </div>
    )

}