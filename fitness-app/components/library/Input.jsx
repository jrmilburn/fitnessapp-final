export default function Input({ 
    inputVal, 
    setInputVal, 
    placeholder,
    disabled
  }) {
  

  
    return (
      <input 
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        className="p-4 w-full border-none outline-none"
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  }
  