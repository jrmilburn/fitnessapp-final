import Link from "next/link"
import Image from "next/image"

export default function Program({ program }) {

    return (
          <Link
                href={`/programs/${program.id}`}
                className="border-b border-black/10 flex justify-between p-2 cursor-pointer group hover:bg-[var(--secondary-bg)]/50 transition-all duration-300"
                >
            <div className="flex flex-col">
              <p>{program.name}</p>
              <p className="opacity-50">{program.length} weeks, {program.days} days per week</p>
            </div>
            <Image 
                src="/icons/chevron-right.svg"
                width={32}
                height={32}
                alt="chevron"
                className="opacity-[0.5] group-hover:translate-x-1 transition-all duration-300"
            />
          </Link>
    )

}