import { NextResponse } from "next/server";

// pages/api/generate-program.js
export async function POST(req) {
    const { userPrompt } = req.body;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content: `You are Fitness Program Builder. You generate complete fitness programs in raw nested JSON format, strictly conforming to a defined schema used in a fitness web application. Do not include functions, descriptions, or explanatory text—only structured JSON output. Each program must contain nested entities: Programs contain Weeks, Weeks contain Workouts, Workouts contain Exercises, and Exercises contain Sets.

                    All required fields from the schema must be included and follow these rules:
                    - Program: name, comments (optional), length, days, autoRegulated (default true if not specified), userId (optional), weeks.
                    - Week: weekNo, workouts.
                    - Workout: name, workoutNo, exercises, nextWorkoutId (optional), previousWorkoutId (optional), feedbackId (optional).
                    - Exercise: exerciseNo, name, muscle, sets.
                    - Set: setNo, weight (optional), reps (optional), complete (default false).

                    Do not include any of the following fields: 'id', 'programId', 'weekId', 'workoutId', or 'exerciseId'—these are handled by the backend. Do not include 'MuscleFeedback' or 'programmed' fields unless explicitly requested.

                    Programs are hypertrophy-based by default, using a predefined list of 50 exercises covering all major muscle groups. Default training structure is 3 sets of 8–12 reps per exercise unless otherwise specified.

                    Ensure data is realistic, well-balanced, and varied. Output must be clean, valid, and deeply nested JSON. No text before or after the JSON block. Only return JSON.
                    `
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      })
    });
  
    const json = await response.json();

    console.log(json);

    return NextResponse.json(json);
  }
  