import Info from "../library/Info";
import CheckBox from "../library/Checkbox";
import Input from "../library/Input";
import Image from "next/image";

export default function ProgramStructure({ programStructure, setProgramStructure, loadLayout, autoRegulated, setAutoRegulated }) {

  const autoRegulationInfo = {
    heading: "Autoregulation",
    infotext: "When enabled, autoregulation adjusts the set volume across the weeks of your program based on your feedback. This means that the system monitors your workout performance and recovery to dynamically tailor the training load for optimal progression."
  };

  return (
    <div className="w-full bg-[var(--secondary-bg)] p-4">
      <form className="flex flex-col gap-6">
        {/* Name Field */}
        <div className="flex w-full gap-4">
        <div className="flex flex-col w-full">
          <p>Name</p>
          <Input 
            inputVal={programStructure.name}
            setInputVal={(val) =>
              setProgramStructure((prev) => ({ ...prev, name: val }))
            }
          />
        </div>

        {/* Comments Field */}
        <div className="flex flex-col w-full">
          <p>Comments</p>
          <textarea 
            name="comments"
            value={programStructure.comments}
            onChange={(e) => setProgramStructure((prev) => ({ ...prev, comments: e.target.value }))}
            className="w-full border-2 border-black/10"
          />
        </div>
        </div>

        {/* Days and Length Fields */}
        <div className="flex gap-8">
          <div className="flex flex-col w-full">
            <p>Days</p>
            <select 
              name="days"
              className="w-full border-2 border-black/10" 
              value={programStructure.days} 
              onChange={(e) => setProgramStructure((prev) => ({ ...prev, days: e.target.value }))}
            >
              <option value={1}>1 / week</option>
              <option value={2}>2 / week</option>
              <option value={3}>3 / week</option>
              <option value={4}>4 / week</option>
              <option value={5}>5 / week</option>
              <option value={6}>6 / week</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <p>Length</p>
            <select 
              name="length"
              className="w-full border-2 border-black/10" 
              value={programStructure.length} 
              onChange={(e) => setProgramStructure((prev) => ({ ...prev, length: e.target.value }))}
            >
              <option value={3}>3 weeks</option>
              <option value={4}>4 weeks</option>
              <option value={5}>5 weeks</option>
              <option value={6}>6 weeks</option>
              <option value={7}>7 weeks</option>
              <option value={8}>8 weeks</option>
            </select>
          </div>
        </div>

        {/* Update Button and Autoregulation Toggle */}
        <div className="w-full flex justify-between">
          <button 
            type="button"
            className="self-start flex gap-2 items-center" 
            onClick={loadLayout}
          >
            Update
            <Image 
              src="/icons/update.svg"
              width={32}
              height={32}
              alt="update icon"
            />
          </button>

          <div className="flex gap-2 items-center">
            <div className="relative mr-4">
              Autoregulation
              <Info 
                heading={autoRegulationInfo.heading}
                infotext={autoRegulationInfo.infotext}
              />
            </div>
            <CheckBox 
              checked={autoRegulated}
              onChange={setAutoRegulated}
            />  
          </div>        
        </div>
      </form>
    </div>
  );
}
