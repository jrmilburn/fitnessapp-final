

import { useState } from "react";

export default function AiProgramGenerator({ setProgram }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateProgram = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: "Create a 4-week hypertrophy program with 3 days/week"
        })
      });

      const data = await response.json();
      const jsonProgram = JSON.parse(data.result); // assuming result is a JSON string
      console.log(data);
      //setProgram(jsonProgram);
    } catch (err) {
      setError("Failed to generate program.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={generateProgram}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Program"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
