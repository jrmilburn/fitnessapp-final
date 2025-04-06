"use client"

import Programs from "../../components/program/Programs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Programs2 from "../../components/program/Programs2"

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
        console.log(data);
      })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {programs.length !== 0 && (
        <div className="flex-1 w-full flex flex-col gap-4 overflow-none">
          <Programs2
            programs={programs}
          />
        </div>
      )}
    </div>
  )
}
