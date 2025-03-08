"use client"

import ProgramStructure from "@/components/new/ProgramStructure"
import WeekLayout from "@/components/new/WeekLayout";
import { useState, useEffect } from 'react';

export default function NewPage() {

    /**state variables to be intialised */
    const [programStructure, setProgramStructure] = useState({
        name: "",
        comments: "",
        length: 0,
        days: 0,
        emphasis: ""
    });
    const [weekLayout, setWeekLayout] = useState(null);


    const program = {
        userId: "1",
        name: "Program 1",
        weeks: [
 
        ]
    }

    const loadLayout = () => {

    }

    return (
        <div className="flex gap-2 max-w-[calc(100% - 16rem)] ml-64 min-h-screen p-4">
            <div className="max-w-2xl mx-auto w-full">
                <ProgramStructure 
                    programStructure={programStructure}
                    setProgramStructure={setProgramStructure}
                    loadLayout={loadLayout}
                />
                <WeekLayout 
                    weekLayout={weekLayout}
                    setWeekLayout={setWeekLayout}
                />
            </div>
        </div>
    )

}