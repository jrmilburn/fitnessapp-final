import { useEffect, useState } from "react";
import Image from "next/image";

export default function ExerciseSearch({ newExercise, shown, setShown }) {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [appliedMuscleFilter, setAppliedMuscleFilter] = useState("");

  useEffect(() => {
    fetch("/data/exercises.json")
      .then((response) => response.json())
      .then((data) => setExercises(data));
  }, []);

  // Apply both the search filter and the applied muscle filter.
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMuscle =
      appliedMuscleFilter === "" || exercise.muscle === appliedMuscleFilter;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div
      className={`fixed z-20 top-0 left-[16rem] bg-[var(--primary-bg)] p-4 w-full max-w-[calc(100%-16rem)] h-screen transition-all duration-300 flex flex-col ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <button
        className="cursor-pointer w-full border-b flex justify-center mb-8"
        onClick={() => setShown(false)}
      >
        <Image
          src="/icons/chevron-right.svg"
          height={32}
          width={32}
          alt="close"
          className="rotate-90"
        />
      </button>
      <div className="mb-4 flex items-center max-w-2xl mx-auto gap-4 w-full">
        {/* Search Input (applied on type) */}
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-black/10 p-2"
        />
        {/* Muscle Filter Dropdown */}
        <div className="flex gap-2 items-center">
          <select
            value={selectedMuscle}
            onChange={(e) => {
              setSelectedMuscle(e.target.value);
              setAppliedMuscleFilter(e.target.value);
            }}
            className="border p-2 border-black/10"
          >
            <option value="">All Muscles</option>
            <option value="Chest">Chest</option>
            <option value="Back">Back</option>
            <option value="Legs">Legs</option>
            <option value="Hamstrings">Hamstrings</option>
            <option value="Shoulders">Shoulders</option>
            <option value="Biceps">Biceps</option>
            <option value="Triceps">Triceps</option>
            <option value="Core">Core</option>
            <option value="Calves">Calves</option>
            <option value="Quads">Quads</option>
            <option value="Glutes">Glutes</option>
          </select>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto max-w-2xl mx-auto border-b border-t border-black/20 w-full">
        {filteredExercises.map((exercise, index) => (
          <div key={index} 
                className="border-b border-black/10 flex justify-between p-2 cursor-pointer group hover:bg-[var(--secondary-bg)]/50 transition-all duration-300"
                onClick={() => {
                    newExercise(exercise);
                    setShown(false);
                }}
                >
            <div className="flex flex-col">
              <p>{exercise.name}</p>
              <p className="opacity-50">{exercise.muscle}</p>
            </div>
            <Image 
                src="/icons/chevron-right.svg"
                width={32}
                height={32}
                alt="chevron"
                className="opacity-[0.5] group-hover:translate-x-1 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
