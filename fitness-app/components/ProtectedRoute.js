// app/components/ProtectedRoute.tsx

'use client';

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';

export default function ProtectedRoute({ children }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  // Define paths that do not require authentication
  const unprotectedPaths = ["/auth/login", "/auth/register"];
  const isUnprotectedPath = unprotectedPaths.includes(pathname);

  useEffect(() => {
    // Ensure the code runs only on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Redirect unauthenticated users to /login if they're accessing protected routes
    if (status === "unauthenticated" && !isUnprotectedPath && isClient) {
      router.push("/auth/login");
    }
  }, [status, router, isUnprotectedPath, isClient]);

  useEffect(() => {
    // Minimum display time for the splash screen (1 second)
    const timer = setTimeout(() => {
      setShouldFadeOut(true); // Trigger fade-out
    }, 1000);

    return () => clearTimeout(timer);
  }, [status]);

  if (status === "loading") {
    // Display a splash screen while fetching session data
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-500 ${
          shouldFadeOut ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ zIndex: 50, pointerEvents: shouldFadeOut ? 'none' : 'auto' }}
      >
        <div className="text-center">
          <div className="animate-bounce">
            <Image src="/logo.png" alt="App logo" width={80} height={80} className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mt-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (status === "authenticated" || isUnprotectedPath) {
    // Render the protected content if authenticated or if the path is unprotected
    return <>{children}</>;
  }

  // Optionally, render nothing or a fallback UI while redirecting
  return null;
}