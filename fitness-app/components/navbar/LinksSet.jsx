import Link from "next/link";
import Image from "next/image";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";

export default function LinksSet ({ links }) {

    return (
        <div className="flex flex-col items-start w-full mb-8 gap-2">
            {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between w-full">
                    <div className="flex gap-2 items-center">
                        <Image 
                            width={32}
                            height={32}
                            src={link.icon}
                            alt="icon"
                        />
                        <Link href={link.href} className="w-full pb-1 text-xl">{link.title}</Link>
                    </div>
                    <ArrowLongRightIcon 
                        className="w-5 h-5"
                    />
                </div>
            ))}
        </div>
    )

}