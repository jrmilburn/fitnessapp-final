import Exercise from "./Exercise"
import Button from "../library/Button";

export default function Workout({ workout, setProgram, program }) { 

    return (
        <div className={`w-full mx-auto flex flex-col gap-4 items-center`}>
            {workout?.exercises?.map((exercise, index) => {
                return (
                    <Exercise 
                        key={index}
                        exercise={exercise}
                        setProgram={setProgram}
                        program={program}
                    />
                )
            })}
        </div>
    )

}