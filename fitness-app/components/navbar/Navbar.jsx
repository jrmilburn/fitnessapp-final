import Button from '@mui/material/Button';
import { useSession, signOut } from "next-auth/react"
import SidebarLinks from "./SidebarLinks"

export default function Navbar() {

    return (
        <div className="min-h-screen max-h-screen min-w-64 border-r fixed left-0 flex flex-col justify-between items-center p-2">

            <div className="w-full">

                <SidebarLinks />
            </div>
            <Button 
                variant="contained"
                onClick={signOut}>
                Sign Out
            </Button>
            
        </div>
    )

}