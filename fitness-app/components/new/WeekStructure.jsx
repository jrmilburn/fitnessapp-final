import WorkoutStructure from "./WorkoutStructure"

export default function WeekLayout({ weekLayout, setWeekLayout }) {

    return (
        <div className="flex gap-2 bg-[var(--secondary-bg)] p-4 overflow-x-auto h-full">
            {weekLayout?.map((workout, index) => {
                return (
                    <WorkoutStructure 
                        key={index+100}
                        workout={workout}
                        setWeekLayout={setWeekLayout}
                    />
                )
            })}
        </div>
    )

}