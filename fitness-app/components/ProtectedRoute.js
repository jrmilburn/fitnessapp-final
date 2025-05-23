// app/components/ProtectedRoute.tsx

'use client';

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';
import Navbar from "./navbar/Navbar";

export default function ProtectedRoute({ children }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  // Define paths that do not require authentication
  const unprotectedPaths = ["/auth/login", "/auth/register", "/"];
  const isUnprotectedPath = unprotectedPaths.includes(pathname);
  const isLandingPage = pathname === "/";

  useEffect(() => {
    // Ensure the code runs only on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Redirect unauthenticated users to /login if they're accessing protected routes

    if(isLandingPage) {
      return
    }

    if (status === "unauthenticated" && !isUnprotectedPath && isClient) {
      router.push("/auth/login");
    } else if (status === "authenticated" && isUnprotectedPath) {

      router.push("/workout")

    }
  }, [status, router, isUnprotectedPath, isClient, isLandingPage]);

  useEffect(() => {
    // Minimum display time for the splash screen (1 second)
    const timer = setTimeout(() => {
      setShouldFadeOut(true); // Trigger fade-out
    }, 1000);

    return () => clearTimeout(timer);
  }, [status]);

  if(isUnprotectedPath || isLandingPage) {
    return <>{children}</>

  } else if (status === "authenticated") {
    return (
      <>
        <Navbar>
          {children}
        </Navbar>
      </>)
  }
}