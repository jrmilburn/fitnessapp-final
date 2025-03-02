"use client"

import { useSession, signOut } from "next-auth/react"

export default function Dashboard() {

    const { data: session } = useSession();

    return (
        <div>
            <button onClick={signOut}>Sign Out</button>
        </div>
    )

}