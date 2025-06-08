"use client"

import NewActivity from "./NewActivity"

import { useState, useEffect } from "react"

export default function ActivityList({ initialActivities }) {

    const [activities, setActivites] = useState([])

    useEffect(() => {
        setActivites(initialActivities);
    }, [])

    return (
        <ul>
            {activities.map((activity) => (
              <li key={activity.id}>
                {activity.title}, {activity.type}
              </li>
            ))}
            <NewActivity 
                setActivites={setActivites}
            />
        </ul>
    )

}