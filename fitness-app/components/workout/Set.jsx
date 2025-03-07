import Input from "../library/Input"
import { useState } from "react"
import AnimatedCheckbox from "../library/Checkbox";

export default function Set({ set }) {

    const [weight, setWeight] = useState(set?.weight || null);
    const [reps, setReps] = useState(set?.reps || null);
    const [confirmed, setConfirmed] = useState(set?.complete);

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
            <AnimatedCheckbox 
                checked={confirmed}
                onChange={setConfirmed}
            />
        </div>
    )

}