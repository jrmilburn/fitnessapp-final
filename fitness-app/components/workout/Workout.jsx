import Exercise from "./Exercise"

export default function Workout({ workout, setProgram }) {

    return (
        <div className="w-full mx-auto flex flex-col items-center">
            {workout?.exercises?.map((exercise, index) => {
                return (
                    <Exercise 
                        key={index}
                        exercise={exercise}
                        setProgram={setProgram}
                    />
                )
            })}
        </div>
    )

}