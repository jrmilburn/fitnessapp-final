import Link from "next/link";
import Image from "next/image";

export default function LinksSet ({ links }) {

    return (
        <div className="flex flex-col items-start w-full mb-8 gap-2">
            {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between w-full py-2 h-full">
                    <div className="flex gap-2 items-center h-full">
                        <Image 
                            width={32}
                            height={32}
                            src={link.icon}
                            alt="icon"
                            className="-translate-y-1"
                        />
                        <Link href={link.href} className="w-full pb-1 text-xl">{link.title}</Link>
                    </div>
                    <Image 
                        width={28}
                        height={28}
                        src="/icons/chevron-right.svg"
                        alt="chevron"
                        className="opacity-[0.4]"
                    />
                </div>
            ))}
        </div>
    )

}