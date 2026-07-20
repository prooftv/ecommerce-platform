"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface AnnouncementBarClientProps {
  id: string;
  text: string;
  href?: string;
  linkLabel?: string;
  backgroundColor: string;
  textColor: string;
  dismissible: boolean;
}

export function AnnouncementBarClient({
  id,
  text,
  href,
  linkLabel,
  backgroundColor,
  textColor,
  dismissible,
}: AnnouncementBarClientProps) {
  const storageKey = `announcement-dismissed-${id}`;
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(storageKey) === "1";
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(storageKey, "1");
    setDismissed(true);
  };

  return (
    <div
      role="banner"
      className="relative flex items-center justify-center px-4 py-2 text-sm font-medium"
      style={{ backgroundColor, color: textColor }}
    >
      <span>
        {text}
        {href && linkLabel && (
          <>
            {" "}
            <a href={href} className="underline underline-offset-2 hover:no-underline">
              {linkLabel}
            </a>
          </>
        )}
      </span>
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:opacity-70 transition-opacity"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
