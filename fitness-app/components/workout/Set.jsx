import Input from "../library/Input"
import { useState } from "react"

export default function Set({ set }) {

    const [weight, setWeight] = useState(set?.weight);
    const [reps, setReps] = useState(set?.reps);

    return (
        <div className="flex justify-between">
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