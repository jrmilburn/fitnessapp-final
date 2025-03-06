"use client"
import { useSession } from "next-auth/react"

export default function Dashboard() {

    const { data: session } = useSession();

    return (
        <div className="w-full min-h-screen flex flex-col gap-4 justify-center items-center">
            <p>{session.user.email} logged in</p>

        </div>
    )

}