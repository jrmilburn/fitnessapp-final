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

        const response = await fetch('/api/new-program', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                weekLayout,
                programStructure
            })
        })

        if(response.ok) {
            router.push('/workout')
        }

      }
      

    return (
        <div className="flex gap-2 max-w-[calc(100% - 16rem)] ml-64 min-h-screen p-4">
            <div className="max-w-[90%] mx-auto w-full h-full flex flex-col gap-4">
                <ProgramStructure 
                    programStructure={programStructure}
                    setProgramStructure={setProgramStructure}
                    loadLayout={loadLayout}
                />
                <WeekLayout 
                    weekLayout={weekLayout}
                    setWeekLayout={setWeekLayout}
                />

                <Button 
                    type="button"
                    text="Create"
                    onClick={createProgram}
                />
            </div>
        </div>
    )

}