import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export function usePageViewTracker() {
  const [location] = useLocation();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (lastTracked.current === location) return;
    lastTracked.current = location;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: location }),
    }).catch(() => {});
  }, [location]);
}
