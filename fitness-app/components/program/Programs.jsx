import Program from "./Program"

export default function Programs({ programs }) {

    return (
        <div className="w-full">
            {programs.map((program, index) => (
                <Program 
                    key={index}
                    program={program}
                />
            ))}
        </div>
    )

}