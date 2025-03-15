import Image from "next/image";
import Input from "../library/Input";

export default function ExerciseStructure({ exercise, onDelete, setWeekLayout }) {

    console.log(exercise);

    return (
        <div className="w-full bg-[var(--primary-bg)] p-2 relative overflow-x-none z-20 cursor-pointer ">
            <p>{exercise.name}</p>
            <p className="opacity-[0.5]">{exercise.muscle}</p>
            <button className="absolute top-0 right-0 cursor-pointer" onClick={onDelete}>
                <Image 
                    src="/icons/close.svg"
                    width={28}
                    height={28}
                    alt="close icon"
                />
            </button>
        </div>
    )

}