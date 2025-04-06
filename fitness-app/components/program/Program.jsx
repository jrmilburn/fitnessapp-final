import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export default function Program({ program, setPrograms }) {
  const [showDelete, setShowDelete] = useState(false);

  const router = useRouter();

  const deleteProgram = async (e) => {
    e.stopPropagation(); // Prevent navigation on delete
    const response = await fetch('/api/program', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programId: program.id })
    });

    let data;

    if(response.ok) {
      data = await response.json();
      setPrograms(data.programs);
    }

    if(data.programs.length === 0) {
      router.push('/new');
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
      <div className="flex items-center gap-4">
        {/* Delete button fades in on hover */}
        <Tooltip title="Delete">
          <IconButton
            onClick={deleteProgram}
            style={{ opacity: showDelete ? 1 : 0, transition: "opacity 200ms ease-in-out" }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="View">
        <Image 
          src="/icons/chevron-right.svg"
          width={32}
          height={32}
          alt="chevron"
          className="opacity-[0.5] transition-all duration-300 cursor-pointer"
        />
        </Tooltip>
      </div>
    </div>
  );
}
