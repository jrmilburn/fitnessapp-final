import { useState } from "react"
import Button from "../library/Button";
import Image from "next/image";
import ScrollUp from "../library/ScrollUp";

export default function ChangeWorkout({ program, setCurrentWorkout }) {

    const [workoutsModalShown, setWorkoutsModalShown] = useState(false);

    const toggleModal = () => {

        const newState = !workoutsModalShown;
        setWorkoutsModalShown(newState);

    }

    return (

        <>
        <button 
            type="button"
            onClick={toggleModal}
            className="cursor-pointer"
        >
            <Image 
                src="/icons/change-workouts.svg"
                width={32}
                height={32}
                alt="change workouts"
            />
        </button>
            <ScrollUp
                modalShown={workoutsModalShown}
                setModalShown={setWorkoutsModalShown}
            >
                <h6 className="mb-8">{program?.name}</h6>
                <div className="flex flex-col gap-2 ml-8">
                {program?.weeks?.map((week, index1) => (
                    <div key={index1} className="flex gap-2 items-center relative">
                        <p className="opacity-[0.5] absolute -left-[120%]">Week {week?.weekNo}</p>
                        {week?.workouts?.map((workout, index2) => {

                            const isWorkoutComplete = workout.exercises.every(exercise =>
                                exercise.sets.every(set => set.complete)
                            );

                        return (
                            <div key={index2} className={`p-2 border-2 cursor-pointer ${isWorkoutComplete && 'bg-[green]/20 border-[green]'}`}
                            onClick={() => {
                                    setCurrentWorkout(program?.weeks[index1]?.workouts[index2]);
                                    toggleModal();
                                }}>
                                {workout?.workoutNo}
                            </div>
                        )})}
                        
                    </div>
                ))}
                </div>
            </ScrollUp>
        </>
    )

}