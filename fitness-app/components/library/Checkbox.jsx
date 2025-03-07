import { useState } from "react";

export default function AnimatedCheckbox({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="min-w-6 min-h-6 border-2 border-gray-300 rounded cursor-pointer flex items-center justify-center transition-colors duration-300 hover:border-blue-500"
    >
      {checked && (
        <svg
          className="w-4 h-4 text-blue-500 transition-transform duration-300 transform"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );
}
