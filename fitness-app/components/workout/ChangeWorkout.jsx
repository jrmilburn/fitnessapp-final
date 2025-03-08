import { useState } from "react"
import Button from "../library/Button";
import Image from "next/image";

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
            <div className={`gap-2 fixed top-0 left-[16rem] bg-[var(--primary-bg)] p-4 w-full max-w-[calc(100%-16rem)] min-h-screen transition-all duration-300 ${workoutsModalShown ? 'translate-y-[0%]' : 'translate-y-[100%]'}`}>
                <button className="cursor-pointer w-full border-b flex justify-center mb-8" onClick={toggleModal}>
                    <Image 
                        src="/icons/chevron-right.svg"
                        height={32}
                        width={32}
                        alt="close"
                        className="rotate-90"
                    />
                </button>
                <div className="flex flex-col max-w-2xl mx-auto items-center">
                <h6 className="mb-8">{program?.name}</h6>
                <div className="flex flex-col gap-2 ml-8">
                {program?.weeks?.map((week, index1) => (
                    <div key={index1} className="flex gap-2 items-center relative">
                        <p className="opacity-[0.5] absolute -left-[120%]">Week {week?.weekNo}</p>
                        {week?.workouts?.map((workout, index2) => (
                            <div key={index2} className="p-2 border-2 cursor-pointer" 
                            onClick={() => {
                                    setCurrentWorkout(program?.weeks[index1]?.workouts[index2]);
                                    toggleModal();
                                }}>
                                {workout?.workoutNo}
                            </div>
                        ))}
                        
                    </div>
                ))}
                </div>
                </div>

            </div>
        </>
    )

}