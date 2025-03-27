import Info from "../library/Info";
import CheckBox from "../library/Checkbox";
import Input from "../library/Input";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProgramStructure({ programStructure, setProgramStructure, loadLayout, autoRegulated, setAutoRegulated }) {
  const autoRegulationInfo = {
    heading: "Autoregulation",
    infotext:
      "When enabled, autoregulation adjusts the set volume across the weeks of your program based on your feedback. This means that the system monitors your workout performance and recovery to dynamically tailor the training load for optimal progression.",
  };

  const [formProgression, setFormProgression] = useState(0);
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  const nextStep = (e) => {
    e.preventDefault();
    setFormProgression((prev) => prev + 1);
  };

  return (
    <div className={`max-w-xl w-full mx-auto ${layoutLoaded ? '' : 'min-h-screen'} flex flex-col gap-4 justify-center items-center`}>
      <h5 className="font-bold">
        {formProgression === 0 ? 'Name your program' :
        formProgression === 1 ? 'Select a weekly frequency' :
        formProgression === 2 ? 'Select a program length' :
        formProgression === 3 ? 'Use automatic volume regulation?' :
        (formProgression === 4 && !layoutLoaded) ? 'Generate Program Layout' :
        ''}
      </h5>
      <motion.form
        layout
        transition={{ duration: 0.1 }}
        className="shadow-md rounded-xl w-full border border-[black]/5 overflow-hidden"
      >
        {formProgression >= 0 && (
          <Input
            inputVal={programStructure.name}
            setInputVal={(val) =>
              setProgramStructure((prev) => ({ ...prev, name: val }))
            }
            placeholder="Choose a name..."
          />
        )}

        {formProgression >= 1 && (
          <div className="flex flex-col w-full relative">
            <select
              name="days"
              className="w-full p-4 border-b border-black/5 appearance-none outline-none"
              value={programStructure.days}
              onChange={(e) =>
                setProgramStructure((prev) => ({
                  ...prev,
                  days: e.target.value,
                }))
              }
            >
              <option value={1}>1 / week</option>
              <option value={2}>2 / week</option>
              <option value={3}>3 / week</option>
              <option value={4}>4 / week</option>
              <option value={5}>5 / week</option>
              <option value={6}>6 / week</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pr-3">
              <Image
                src="/icons/chevron-right.svg"
                height={24}
                width={24}
                alt="next button"
                className="rotate-[90deg]"
              />
            </div>
          </div>
        )}

        {formProgression >= 2 && (
          <div className="flex flex-col w-full relative">
            <select
              name="length"
              className="w-full p-4 border-b border-black/5 appearance-none outline-none"
              value={programStructure.length}
              onChange={(e) =>
                setProgramStructure((prev) => ({
                  ...prev,
                  length: e.target.value,
                }))
              }
            >
              <option value={3}>3 weeks</option>
              <option value={4}>4 weeks</option>
              <option value={5}>5 weeks</option>
              <option value={6}>6 weeks</option>
              <option value={7}>7 weeks</option>
              <option value={8}>8 weeks</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pr-3">
              <Image
                src="/icons/chevron-right.svg"
                height={24}
                width={24}
                alt="next button"
                className="rotate-[90deg]"
              />
            </div>
          </div>
        )}

        {formProgression >= 3 && (
          <div className="flex gap-2 items-center p-2">
            <div className="relative p-2 w-full">
              <Info
                heading={autoRegulationInfo.heading}
                infotext={autoRegulationInfo.infotext}
              />
              <div className="flex justify-center gap-4">
                <button
                  className={`${
                    autoRegulated
                      ? "bg-[var(--accent)] text-[white]"
                      : "bg-[var(--primary-bg)]"
                  } border border-[var(--accent)] transition-all duration-300 py-1 px-2 rounded cursor-pointer`}
                  onClick={(e) => {
                    e.preventDefault();
                    setAutoRegulated(true);
                  }}
                >
                  Yes
                </button>
                <button
                  className={`${
                    autoRegulated
                      ? "bg-[var(--primary-bg)]"
                      : "bg-[var(--accent)] text-[white]"
                  } border border-[var(--accent)] transition-all duration-300 py-1 px-2 rounded cursor-pointer`}
                  onClick={(e) => {
                    e.preventDefault();
                    setAutoRegulated(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {formProgression === 4 ? (
          <button 
            type="button"
            className="border border-[var(--accent)] transition-all duration-300 py-1 px-2 cursor-pointer rounded-xl w-full mx-auto hover:bg-[var(--accent)] hover:text-[white]" 
            onClick={(e) => {
              setLayoutLoaded(true);
              loadLayout(e);
            }}
          >
            {layoutLoaded ? 'Update Layout' : 'Generate Layout'}
          </button>
        ) : (
        <div className="flex justify-between w-full pr-4 py-4">
        <div></div>
        <button className="cursor-pointer" onClick={nextStep}>
          <Image
            src="/icons/next.svg"
            height={32}
            width={32}
            alt="next button"
          />
        </button>
        </div>
        )}
      </motion.form>
    </div>
  );
}
