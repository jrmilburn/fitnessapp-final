import ChangeWorkout from "./ChangeWorkout"

export default function WorkoutHeader({ program, currentWorkout, setCurrentWorkout }){

    return (
        <div className="w-full bg-[var(--secondary-bg)] flex justify-between p-4">

            <div className="flex flex-col">
                <h6>{currentWorkout?.name}, workout: {currentWorkout?.workoutNo}</h6>
                <p className="opacity-50">{program?.name}</p>
            </div>

            <ChangeWorkout 
                program={program}
                setCurrentWorkout={setCurrentWorkout}
            />

        </div>
    )

}