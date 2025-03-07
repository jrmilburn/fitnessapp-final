import Set from "./Set"

export default function Exercise({ exercise }) {

    return (
        <div>
            {exercise?.name}
            {exercise?.sets?.map((set) => {
                return (
                    <Set 
                        set={set}
                    />
                )
            })}
        </div>
    )

}