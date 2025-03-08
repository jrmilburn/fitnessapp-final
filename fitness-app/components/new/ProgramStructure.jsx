import Input from "../library/Input";
import { useState } from "react";

export default function ProgramStructure({ programStructure, setProgramStructure, loadLayout }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [length, setLength] = useState(4);
    const [days, setDays] = useState(3);

    return (
        <div className="w-full bg-[var(--secondary-bg)] p-4">
            <form className="flex flex-col gap-2">
                
                <div className="flex gap-4 items-center">
                    <p>Name </p>
                <Input 
                    inputVal={name}
                    setInputVal={setName}
                />
                </div>
                <div className="flex gap-4 text-center">
                    <p>Description </p>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border-2 border-black/10"
                    />
                </div>
                <div className="flex gap-8">
                    <div className="flex gap-2 w-full">

                        <p>Frequency </p>
                        <select className="w-full border-2 border-black/10">
                            <option value={4}>4/week</option>
                            <option value={5}>5/week</option>
                            <option value={6}>6/week</option>
                        </select>

                    </div>
                    <div className="flex gap-2 w-full">

                    <p>Length </p>
                    <select className="w-full border-2 border-black/10">
                        <option value={4}>4 weeks</option>
                        <option value={5}>5 weeks</option>
                        <option value={6}>6 weeks</option>
                    </select>

                    </div>
                </div>
            </form>
        </div>
    )

}