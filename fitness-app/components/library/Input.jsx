export default function Input({ inputVal, setInputVal }) {

    return (
        <input 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
        />
    )

}