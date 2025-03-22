import Image from "next/image";
import Input from "../library/Input";

import { useState } from "react";

export default function ExerciseStructure({ exercise, onDelete, setWeekLayout, autoRegulated }) {

    console.log(exercise);
    const [setCount, setSetCount] = useState(1);

    return (
        <div className="w-full bg-[var(--primary-bg)] p-2 relative overflow-x-none z-20 cursor-pointer ">
            <p>{exercise.name}</p>
            <p className="opacity-[0.5]">{exercise.muscle}</p>
            
            {!autoRegulated && (
                <div className="w-full flex items-center gap-4">
                    <div>Sets: {setCount}</div>
                    <div className="flex flex-col items-center gap-1">
                        <button className="bg-[var(--accent)] text-white padding-2 w-8 cursor-pointer">+</button>
                        <button className="bg-[var(--accent)] text-white padding-2 w-8 cursor-pointer">-</button>
                    </div>
                </div>
            )}
            <button className="absolute top-0 right-0 cursor-pointer" onClick={onDelete}>
                <Image 
                    src="/icons/close.svg"
                    width={28}
                    height={28}
                    alt="close icon"
                />
            </button>
            <div className="w-full bg-black/20 h-[1px] my-2"></div>
        </div>
    )

}