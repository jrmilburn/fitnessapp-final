"use client"

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProvider>

      <body
        className={`antialiased w-full h-full`}
      >
        <ProtectedRoute>
          {/**Navbar only on protected routes */}
          {children}
        </ProtectedRoute>

      </body>
      </SessionProvider>

    </html>
  );
}
