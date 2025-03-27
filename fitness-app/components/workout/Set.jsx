import Input from "../library/Input"
import { useState, useEffect } from "react"
import AnimatedCheckbox from "../library/Checkbox";
import Image from "next/image";
import ScrollUp from "../library/ScrollUp";

export default function Set({ set, setProgram }) {

    const [weight, setWeight] = useState(set?.weight || "");
    const [reps, setReps] = useState(set?.reps || "");
    const [confirmed, setConfirmed] = useState(set?.complete);
    const [modalShown, setModalShown] = useState(false);

    const toggleModal = () => {

      const newState = !modalShown;

      setModalShown(newState);

    }

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
      <>
        <div className="flex gap-4 w-full items-center">
            <button onClick={toggleModal} className="w-12 cursor-pointer">
              <Image 
                src="/icons/vert-dots.svg"
                width={32}
                height={32}
                alt="more"
                className="w-full h-full"
              />
            </button>
            <div className="w-full border-b border-[black]/10 overflow-hidden flex">
            <Input 
                inputVal={weight}
                setInputVal={setWeight}
                placeholder="Weight"
            />
            </div>
            <div className="w-full border-b border-[black]/10 overflow-hidden flex">
            <Input 
                inputVal={reps}
                setInputVal={setReps}
                placeholder="Reps"
            />
            </div>
            <AnimatedCheckbox 
                checked={confirmed}
                onChange={() => updateSet()}
            />
        </div>

        <ScrollUp
          modalShown={modalShown}
          setModalShown={setModalShown}
        >

        </ScrollUp>

      </>
    )

}