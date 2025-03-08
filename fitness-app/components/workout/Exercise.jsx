import Set from "./Set"

export default function Exercise({ exercise }) {

    return (
        <div className="bg-[var(--secondary-bg)] p-4 w-full">
            <p>{exercise?.name}</p>
            <div className="mt-4 flex flex-col gap-2 w-full">
            {exercise?.sets?.map((set, index) => {
                return (
                    <Set 
                        key={index}
                        set={set}
                    />
                )
            })}
            </div>
        </div>
    )

}