'use client'

import { useSession }         from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect }          from "react"
import Navbar                 from "./navbar/Navbar"

const unprotected = ["/", "/auth/login", "/auth/register"]

export default function ProtectedRoute({ children }) {
  const { status }   = useSession()           // "loading" | "authenticated" | "unauthenticated"
  const pathname     = usePathname()
  const router       = useRouter()

  const isOpenRoute  = unprotected.includes(pathname)

  useEffect(() => {
    if (status === "unauthenticated" && !isOpenRoute) {
      router.replace("/auth/login")
    } else if (status === "authenticated" && isOpenRoute && pathname !== "/") {
      router.replace("/workout")
    }
  }, [status, isOpenRoute, pathname, router])

  if (isOpenRoute)        return <>{children}</>
  if (status === "loading") return null      // splash / spinner
  if (status === "authenticated") {
    return <Navbar>{children}</Navbar>
  }

  // Fallback for unauthenticated while redirecting
  return null
}
