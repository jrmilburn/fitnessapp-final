import Info from "../library/Info";
import CheckBox from "../library/Checkbox";
import Input from "../library/Input";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Select, MenuItem, InputLabel, FormControl, TextField } from "@mui/material";

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
    <div className={`max-w-xl w-full mx-auto flex flex-col gap-4 justify-center items-center`}>
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
        className="shadow-md rounded-xl w-full border border-[black]/5"
      >
        {formProgression >= 0 && (
          <TextField
            value={programStructure.name}
            onChange={(e) =>
              setProgramStructure((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Choose a name..."
            className="w-full p-2"
          />
        )}

        {formProgression >= 1 && (
          <div className="flex flex-col w-full relative my-2">
            <FormControl>
            <InputLabel id="days-label">Days</InputLabel>
            <Select
              labelId="days-label"
              id="days-select"
              label="Days"
              className="w-full"
              value={programStructure.days}
              onChange={(e) =>
                setProgramStructure((prev) => ({
                  ...prev,
                  days: e.target.value,
                }))
              }
            >
              <MenuItem value={1}>1 / week</MenuItem>
              <MenuItem value={2}>2 / week</MenuItem>
              <MenuItem value={3}>3 / week</MenuItem>
              <MenuItem value={4}>4 / week</MenuItem>
              <MenuItem value={5}>5 / week</MenuItem>
              <MenuItem value={6}>6 / week</MenuItem>
            </Select>
            </FormControl>
          </div>
        )}

        {formProgression >= 2 && (
          <div className="flex flex-col w-full relative my-2">
            <FormControl>
            <InputLabel id="weeks-label">Weeks</InputLabel>
            <Select
              labelId="weeks-label"
              id="weeks-select"
              label="Weeks"
              className="w-full"
              value={programStructure.length}
              onChange={(e) =>
                setProgramStructure((prev) => ({
                  ...prev,
                  length: e.target.value,
                }))
              }
            >
              <MenuItem value={3}>3 weeks</MenuItem>
              <MenuItem value={4}>4 weeks</MenuItem>
              <MenuItem value={5}>5 weeks</MenuItem>
              <MenuItem value={6}>6 weeks</MenuItem>
              <MenuItem value={7}>7 weeks</MenuItem>
              <MenuItem value={8}>8 weeks</MenuItem>
            </Select>
            </FormControl>
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
