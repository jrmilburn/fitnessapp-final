"use client"

import Programs from "../../components/program/Programs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProgramPage() {

    const router = useRouter();

    const [programs, setPrograms] = useState([])

    useEffect(() => {

        fetch('/api/programs')
        .then(response => response.json())
        .then(data => {

            if (!data || data.length === 0) {
                router.push("/new");
                return;
              }

            setPrograms(data);
        })

    }, [])

    return (
        <div className="flex gap-2 max-w-[calc(100% - 16rem)] ml-64 min-h-screen p-4">
            {programs.length !== 0 && (
                <div className="max-w-[90%] mx-auto w-full h-full flex flex-col gap-4">
                    <h6 className="">Programs</h6>
                    <Programs 
                        programs={programs}
                        setPrograms={setPrograms}
                    />
                </div>
            )}
        </div>
    )

}