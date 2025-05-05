"use client"

export default function ProgramPreview({ programStructure, weekLayout, autoRegulated }) {
  // For auto-regulated programs, we only show the first week
  const weeksToDisplay = autoRegulated ? [weekLayout[0]] : weekLayout

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{programStructure.name}</h2>
            <p className="text-gray-500">
              {programStructure.length} weeks, {programStructure.days} days per week
            </p>
          </div>
          {autoRegulated && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-300">
              Auto-Regulated
            </span>
          )}
        </div>

        {programStructure.comments && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">Program Notes:</h4>
            <p className="text-sm text-gray-600">{programStructure.comments}</p>
          </div>
        )}

        {autoRegulated && (
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p className="text-sm">
              <strong>Auto-regulation enabled:</strong> This program will automatically adjust training volume in
              subsequent weeks based on your performance feedback.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {weeksToDisplay.map((week) => (
          <details key={week.weekNo} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-medium flex items-center justify-between hover:bg-gray-50">
              Week {week.weekNo}
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {week.workouts.map((workout) => (
                  <div
                    key={`preview-${week.weekNo}-${workout.workoutNo}`}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-medium mb-2">{workout.name}</h3>
                    {workout.exercises.length > 0 ? (
                      <ul className="space-y-2">
                        {workout.exercises.map((exercise, index) => (
                          <li key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-sm text-gray-500">
                              {exercise.sets?.length || 0} × {exercise.sets?.[0]?.reps || 0}
                              {exercise.sets?.[0]?.weight > 0 && ` @ ${exercise.sets[0].weight}kg`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-2 text-gray-500">No exercises added</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}

        {autoRegulated && programStructure.length > 1 && (
          <details className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-medium flex items-center justify-between hover:bg-gray-50">
              Weeks 2-{programStructure.length} (Auto-Regulated)
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm">
                  Subsequent weeks will follow the same exercise selection as Week 1, with volume adjustments based on
                  your performance feedback. The system will automatically optimize your training load for maximum
                  progress.
                </p>
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
