export default function Input({ inputVal, setInputVal }) {

    return (
        <input 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="p-1 bg-[var(--primary-bg)] w-full"
        />
    )

}