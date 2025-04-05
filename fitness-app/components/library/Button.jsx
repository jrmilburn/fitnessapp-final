import { ArrowLongRightIcon } from '@heroicons/react/24/solid';

export default function Button({ type, text, onClick }) {
    return (
      <>
      <button
        type={type}
        className="w-full max-w-60
                bg-[var(--accent)] text-[var(--primary-bg)] 
                px-4 py-2 relative 
                group cursor-pointer"
        onClick={onClick}
      >
        {text}
        <ArrowLongRightIcon className="h-5 w-5 ml-2 
                                    text-[var(--primary-bg)] 
                                    absolute right-[20%] top-[50%] -translate-y-[50%] 
                                    group-hover:translate-x-1
                                    transition-all duration-300" />
      </button>
      </>
    );
  }
  