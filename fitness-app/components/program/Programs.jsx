"use client"

import { useState, useEffect } from 'react'

import Program from "./Program"

export default function Programs({ programs, setPrograms }) {

    return (
        <div className="w-full">
            {programs.map((program, index) => (
                <Program 
                    key={index}
                    program={program}
                    setPrograms={setPrograms}
                />
            ))}
        </div>
    )

}