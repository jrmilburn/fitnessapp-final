import WorkoutStructure from "./WorkoutStructure";
import { useState } from "react";

export default function WeekLayout({ weekLayout, setWeekLayout }) {

    const [draggingId, setDraggingId] = useState(-1);

  return (
    <div className="w-full bg-[var(--secondary-bg)] p-4 h-full flex justify-center">
      <div className="flex gap-2 overflow-x-auto">
        {weekLayout?.map((workout, index) => (
          <WorkoutStructure 
            key={index + 100}
            workout={workout}
            setWeekLayout={setWeekLayout}
            setDraggingId={setDraggingId}
          />
        ))}
      </div>
    </div>
  );
}
