import ScrollUp from "./ScrollUp";
import { useState } from "react";

export default function ConfirmationModal({
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    onConfirm,
    onCancel,
    children
  }) {

    const [confirmationShown, setConfirmationShown] = useState(false);

    const toggleModal = () => {

        const newState = !confirmationShown;
        setConfirmationShown(newState);

    }

    return (
        <>
            <button className="cursor-pointer" onClick={toggleModal}>
                {children}
            </button>
            <ScrollUp
                modalShown={confirmationShown}
                setModalShown={() => {
                    onCancel();
                    setConfirmationShown(false)
                }}
            >
                <h6>{title}</h6>
                <p className="mb-8">{message}</p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[green]/20 border border-[green]/40 cursor-pointer" onClick={() => {
                        onConfirm();
                        setConfirmationShown(false)
                        }}>Confirm</button>
                    <button className="px-4 py-2 bg-[black]/20 border border-[black]/40 cursor-pointer" onClick={() => {
                        onCancel();
                        setConfirmationShown(false);
                        }}>Cancel</button>
                </div>
            </ScrollUp>
        </>
        
    );
  }
  