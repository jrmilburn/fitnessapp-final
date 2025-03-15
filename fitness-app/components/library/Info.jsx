import Image from "next/image"
import { useState } from "react"
import ScrollUp from "./ScrollUp";

export default function Info({ heading, infotext }) {

    const [infoShown, setInfoShown] = useState(false);

    const toggleShown = () => {

        const newState = !infoShown;

        setInfoShown(newState);

    }

    return (
        <>
        <div className="absolute top-[-15%] right-[-15%] cursor-pointer" onClick={() => toggleShown()}>
            <Image 
                width={16}
                height={16}
                src="/icons/info.svg"
                alt="info"
            />
        </div>

        <ScrollUp
            modalShown={infoShown}
            setModalShown={() => toggleShown()}
        >
            <h6 className="mb-8 text-left">{heading}</h6>
            {infotext}
        </ScrollUp>

        </>

    )

}