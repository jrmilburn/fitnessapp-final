import Button from "../library/Button"
import { useSession, signOut } from "next-auth/react"
import SidebarLinks from "./SidebarLinks"

export default function Navbar() {

    return (
        <div className="min-h-screen max-h-screen min-w-64 border-r fixed left-0 flex flex-col justify-between items-center p-2">

            <div className="w-full">
                <h4 className="mb-8">App Logo</h4>

                <SidebarLinks />
            </div>

            <Button 
                type="button"
                text="Sign Out"
                onClick={signOut}
            />
        </div>
    )

}