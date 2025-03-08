import Input from "../library/Input"
import { useState, useEffect } from "react"
import AnimatedCheckbox from "../library/Checkbox";

export default function Set({ set, setProgram }) {

    const [weight, setWeight] = useState(set?.weight || "");
    const [reps, setReps] = useState(set?.reps || "");
    const [confirmed, setConfirmed] = useState(set?.complete);

    useEffect(() => {
        const targetSetId = set.id;
      
        setProgram(prevProgram => ({
          ...prevProgram,
          weeks: prevProgram.weeks.map(week => ({
            ...week,
            workouts: week.workouts.map(workout => ({
              ...workout,
              exercises: workout.exercises.map(exercise => ({
                ...exercise,
                sets: exercise.sets.map(s =>
                  s.id === targetSetId
                    ? { ...s, complete: confirmed, weight: weight, reps: reps }
                    : s
                )
              }))
            }))
          }))
        }));
      }, [confirmed, weight, reps]);
      

    return (
        <div className="flex gap-2 w-full">
            <p className="opacity-[0.5]">{set?.setNo}</p>
            <Input 
                inputVal={weight}
                setInputVal={setWeight}
            />
            <Input 
                inputVal={reps}
                setInputVal={setReps}
            />
            <AnimatedCheckbox 
                checked={confirmed}
                onChange={setConfirmed}
            />
        </div>
    )

}