import { useState, useEffect } from "react"
import Checkbox from '@mui/material/Checkbox';
import { TextField } from "@mui/material";
import Image from "next/image";
import ScrollUp from "../library/ScrollUp";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function Set({ set, setProgram, exerciseId, viewonly }) {

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

      const removeSet = async () => {
        const response = await fetch(`/api/set/${set.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      
        if (response.ok) {
          // Remove the set with set.id from the program state
          setProgram(prevProgram => ({
            ...prevProgram,
            weeks: prevProgram.weeks.map(week => ({
              ...week,
              workouts: week.workouts.map(workout => ({
                ...workout,
                exercises: workout.exercises.map(exercise => ({
                  ...exercise,
                  sets: exercise.sets.filter(s => s.id !== set.id)
                }))
              }))
            }))
          }));
        }
      }

      const addSet = async () => {
        const response = await fetch('/api/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weight: 0,
            reps: 0,
            complete: false,
            exerciseId: exerciseId
          })
        });
      
        if (response.ok) {
          // Assume the API returns the newly created set as JSON.
          const newSet = await response.json();
      
          // Update the program state by finding the exercise with the matching exerciseId
          // and appending the new set to its sets array.
          setProgram(prevProgram => ({
            ...prevProgram,
            weeks: prevProgram.weeks.map(week => ({
              ...week,
              workouts: week.workouts.map(workout => ({
                ...workout,
                exercises: workout.exercises.map(exercise => {
                  if (exercise.id === exerciseId) {
                    return {
                      ...exercise,
                      sets: [...exercise.sets, newSet.set]
                    };
                  }
                  return exercise;
                })
              }))
            }))
          }));
        }
      };
      
      
      

    return (
      <>
        <div className="flex gap-4 w-full items-center">
            {!viewonly && (
              <button onClick={toggleModal} className="w-12 cursor-pointer">
                <Image 
                  src="/icons/vert-dots.svg"
                  width={32}
                  height={32}
                  alt="more"
                  className="w-full h-full"
                />
              </button>
            ) }
            <AppTheme>
            <div className="w-full flex">
            <TextField 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              disabled={viewonly}
              placeholder="Weight"
              className="w-full"
              type="number"
            />
            </div>
            <div className="w-full flex">
            <TextField 
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              disabled={viewonly}
              placeholder="Weight"
              className="w-full"
              type="number"
            />
            </div>
            {!viewonly && (
              <Checkbox 
                {...label}
                {...(confirmed ? { checked: true } : {})}
                onClick={() => updateSet()}
              />
            )}
          </AppTheme>

        </div>

        <ScrollUp
          modalShown={modalShown}
          setModalShown={setModalShown}
        >
          <div className="w-full flex flex-col items-center gap-4">
            <button className="px-4 py-2 bg-[green]/70 text-white rounded-lg cursor-pointer"
              onClick={() => {
                addSet();
                setModalShown(false);
              }}
            >
              Add Set
            </button>
            <button className="px-4 py-2 bg-[red]/70 text-white rounded-lg cursor-pointer" 
              onClick={() => {
                removeSet();
                setModalShown(false);
              }}>
              Delete Set
            </button>
          </div>
        </ScrollUp>

      </>
    )

}