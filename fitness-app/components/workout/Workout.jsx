import Exercise from "./Exercise"

export default function Workout({ workout }) {

    console.log(workout);

    return (
        <div className="w-full mx-auto flex flex-col items-center">
            {workout?.exercises?.map((exercise, index) => {
                return (
                    <Exercise 
                        key={index}
                        exercise={exercise}
                    />
                )
            })}
        </div>
    )

}