"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProvider>

      <body
        className={`antialiased w-full h-full`}
      >
        <ProtectedRoute>
          {children}
        </ProtectedRoute>

      </body>
      </SessionProvider>

    </html>
  );
}
