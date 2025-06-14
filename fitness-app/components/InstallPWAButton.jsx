"use client";

import { useEffect, useState } from "react";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(userAgent);
    const isInStandalone = window.navigator.standalone === true;

    setIsIOS(isiOS);
    setIsStandalone(isInStandalone);

    if (isiOS && !isInStandalone) {
      // iOS Safari and NOT installed
      setShowInstallButton(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      // Android/Desktop PWA support
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      alert(
        "To install this app:\n\n1. Tap the Share icon (the square with an arrow)\n2. Tap 'Add to Home Screen'"
      );
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  if (!showInstallButton) return null;

  return (
    <button
      onClick={handleInstallClick}
      style={{
        padding: "10px 20px",
        background: "#0070f3",
        color: "rgba(0,0,0,0.5)",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "white",
        cursor: "pointer",
      }}
    >
      Install App
    </button>
  );
}
