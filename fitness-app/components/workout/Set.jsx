import Input from "../library/Input"
import { useState } from "react"

export default function Set({ set }) {

    const [weight, setWeight] = useState(set?.weight || null);
    const [reps, setReps] = useState(set?.reps || null);

    return (
        <div className="flex gap-2 w-full">
            <Input 
                inputVal={weight}
                setInputVal={setWeight}
            />
            <Input 
                inputVal={reps}
                setInputVal={setReps}
            />
        </div>
    )

}