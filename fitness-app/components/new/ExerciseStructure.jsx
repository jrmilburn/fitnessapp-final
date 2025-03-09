export default function ExerciseStructure({ exercise }) {

    console.log(exercise);

    return (
        <div className="w-full bg-[var(--primary-bg)] p-2">
            <p>{exercise.name}</p>
            <p className="opacity-[0.5]">{exercise.muscle}</p>
        </div>
    )

}