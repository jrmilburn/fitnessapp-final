'use client';                // ← tell Next.js this file runs in the browser
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

export default function UserProfile({ userId }) {
  const [src, setSrc] = useState(null);      // null = not loaded yet
  const [error, setError] = useState(false); // simple error flag

  useEffect(() => {
    let cancelled = false;                   // cleanup guard

    (async () => {
      try {
        const res = await fetch(`/api/profile-picture/${userId}`, {
          cache: 'no-store',                 // always fetch the latest image
        });

        if (!res.ok) throw new Error('Fetch failed');

        const { profilePictureUrl } = await res.json();

        if (!cancelled) setSrc(profilePictureUrl || null);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;                      // abort state-updates if unmounted
    };
  }, [userId]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
      {src && !error ? (
        <img
          src={src}               /* base-64 data-URL from the API */
          alt="Profile"
          className="h-full w-full object-cover overflow-hidden"
        />
      ) : (
        <User className="h-5 w-5" /> /* fallback icon */
      )}
    </div>
  );
}
