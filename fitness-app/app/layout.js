"use client"

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ProtectedRoute from "../components/ProtectedRoute";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
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
