import Exercise from "./Exercise"

export default function Workout({ workout }) {

    console.log(workout);

    return (
        <>
            {workout?.exercises?.map((exercise, index) => {
                return (
                    <Exercise 
                        key={index}
                        exercise={exercise}
                    />
                )
            })}
        </>
    )

}