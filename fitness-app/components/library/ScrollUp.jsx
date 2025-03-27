import Image from "next/image"

export default function ScrollUp({ children, modalShown, setModalShown  }){

    return (
        <div className={`gap-2 fixed z-40 top-0 left-[16rem] bg-[var(--primary-bg)] p-4 w-full max-w-[calc(100%-16rem)] min-h-screen transition-all duration-300 ${modalShown ? 'translate-y-[0%]' : 'translate-y-[100%]'}`}>
            <button className="cursor-pointer w-full border-b flex justify-center mb-8" onClick={setModalShown}>
                <Image 
                    src="/icons/chevron-right.svg"
                    height={32}
                    width={32}
                    alt="close"
                    className="rotate-90"
                />
            </button>
            <div className="flex flex-col max-w-2xl mx-auto items-center overflow-y-auto max-h-[calc(100vh-100px)]">
                {children}
            </div>
        </div>
    )

}