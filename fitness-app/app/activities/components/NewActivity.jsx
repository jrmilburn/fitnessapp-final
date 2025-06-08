import { useState } from "react"
import ActivityModal from "./ActivityModal"

export default function NewActivity({ setActivites }) {

    const [modalOpen, setModalOpen] = useState(false);
    const [activityTitle, setActivityTitle] = useState("");
    const [activityType, setActivityType] = useState("");

    const handleAdd = async () => {

        const response = await fetch('/api/activity/create', {
            method: 'POST',
            body: JSON.stringify({
                title: activityTitle,
                type: activityType
            })
        })

        if(response.ok) {

            const data = await response.json();

            setActivites(...prev => {
                return [...prev, data]
            })
        }

    }

    return (
        <>
        <button
            onClick={() => setModalOpen(true)}
        >
            + New Activity
        </button>

        {modalOpen && (
            <ActivityModal 
                handleAdd={handleAdd}
                title={activityTitle}
                setTitle={setActivityTitle}
                type={activityType}
                setType={setActivityType}
            />
        )}

        </>
    )

}