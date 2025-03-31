import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Program({ program, setPrograms }) {
  const [showDelete, setShowDelete] = useState(false);

  const deleteProgram = async (e) => {
    e.stopPropagation(); // Prevent navigation on delete
    const response = await fetch('/api/program', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programId: program.id })
    });

    if(response.ok) {
      const data = await response.json();
      setPrograms(data.programs);
    }
  };

  return (
    <div 
      className="flex items-center border-b border-black/10 p-2 hover:bg-[var(--secondary-bg)]/50 transition-all duration-300"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Link href={`/program/${program.id}`} className="flex-1">
        <div className="flex flex-col">
          <p>{program.name}</p>
          <p className="opacity-50">
            {program.length} weeks, {program.days} days per week
          </p>
        </div>
      </Link>
      <div className="flex items-center">
        {/* Delete button fades in on hover */}
        <button 
          onClick={deleteProgram} 
          className={`transition-all cursor-pointer duration-300 mr-2 p-1 text-red-600 ${showDelete ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-label="Delete Program"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7" />
          </svg>
        </button>
        <Image 
          src="/icons/chevron-right.svg"
          width={32}
          height={32}
          alt="chevron"
          className="opacity-[0.5] transition-all duration-300"
        />
      </div>
    </div>
  );
}
