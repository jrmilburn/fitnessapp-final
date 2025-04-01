"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import Program from "./Program"

export default function Programs({ programs, setPrograms }) {

    const router = useRouter();

    return (
        <div className="w-full">
            {programs.map((program, index) => (
                <Program 
                    key={index}
                    program={program}
                    programs={programs}
                    setPrograms={setPrograms}
                />
            ))}
        </div>
    )

}