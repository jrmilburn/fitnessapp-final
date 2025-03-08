import Set from "./Set"

export default function Exercise({ exercise, setProgram }) {

    return (
        <div className="bg-[var(--secondary-bg)] p-4 w-full">
            <h6>{exercise?.name}</h6>
            <div className="mt-4 flex flex-col gap-2 w-full">
            <div className="flex w-full justify-around">
                <p>Weight</p>
                <p className="-translate-x-[50%]">Reps</p>
            </div>
            {exercise?.sets?.map((set) => {
                return (
                    <Set 
                        key={set.id}
                        set={set}
                        setProgram={setProgram}
                    />
                )
            })}
            </div>
        </div>
    )

}