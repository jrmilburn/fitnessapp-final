import Input from "../library/Input"
import { useState, useEffect } from "react"
import AnimatedCheckbox from "../library/Checkbox";
import Image from "next/image";

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

      const updateSet = async () => {

        const newCompleted = !confirmed;

        const response = await fetch('/api/set',{
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weight: parseFloat(weight),
            reps: parseInt(reps),
            complete: newCompleted,
            setId: set.id
          })
        })

        setConfirmed(newCompleted);

        console.log(await response.json());

      }
      

    return (
        <div className="flex gap-2 w-full items-center">
            <Image 
              src="/icons/vert-dots.svg"
              width={32}
              height={32}
              alt="more"
            />
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
                onChange={() => updateSet()}
            />
        </div>
    )

}