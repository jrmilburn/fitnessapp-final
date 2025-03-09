import Input from "../library/Input";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProgramStructure({ programStructure, setProgramStructure, loadLayout }) {



  return (
    <div className="w-full bg-[var(--secondary-bg)] p-4">
      <form className="flex flex-col gap-2">
        <div className="flex gap-4 items-center">
          <p>Name</p>
          <Input 
            inputVal={programStructure.name}
            setInputVal={(val) =>
              setProgramStructure((prev) => ({ ...prev, name: val }))
            }
          />
        </div>
        <div className="flex gap-4 text-center">
          <p>Comments</p>
          <textarea 
            name="comments"
            value={programStructure.comments}
            onChange={(e) => setProgramStructure((prev) => ({...prev, comments: e.target.value}))}
            className="w-full border-2 border-black/10"
          />
        </div>
        <div className="flex gap-8">
          <div className="flex gap-2 w-full">
            <p>Days</p>
            <select 
              name="days"
              className="w-full border-2 border-black/10" 
              value={programStructure.days} 
              onChange={(e) => setProgramStructure((prev) => ({...prev, days: e.target.value}))}>
                <option value={1}>1 / week</option>
                <option value={2}>2 / week</option>
                <option value={3}>3 / week</option>
                <option value={4}>4 / week</option>
                <option value={5}>5 / week</option>
                <option value={6}>6 / week</option>
            </select>
          </div>
          <div className="flex gap-2 w-full">
            <p>Length</p>
            <select 
              name="length"
              className="w-full border-2 border-black/10" 
              value={programStructure.length} 
              onChange={(e) => setProgramStructure((prev) => ({...prev, length: e.target.value}))}>
                <option value={3}>3 weeks</option>
                <option value={4}>4 weeks</option>
                <option value={5}>5 weeks</option>
                <option value={6}>6 weeks</option>
                <option value={7}>7 weeks</option>
                <option value={8}>8 weeks</option>
            </select>
          </div>
        </div>
        <button 
          className="self-start flex gap-2 items-center" 
          onClick={loadLayout}>
          Update
          <Image 
            src="/icons/update.svg"
            width={32}
            height={32}
            alt="update icon"
          />
        </button>
      </form>
    </div>
  );
}
