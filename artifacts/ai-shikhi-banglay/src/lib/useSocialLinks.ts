import { useState, useEffect } from "react";

export interface SocialLink {
  id: number;
  label: string;
  url: string;
  icon: string;
  displayOrder: number;
}

let cache: SocialLink[] | null = null;
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function invalidateSocialLinksCache() {
  cache = null;
  notify();
}

export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>(cache ?? []);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    const update = () => setLinks(cache ?? []);
    listeners.push(update);

    if (cache === null) {
      fetch("/api/social-links")
        .then((r) => r.json())
        .then((data: SocialLink[]) => {
          cache = data;
          notify();
        })
        .catch(() => {
          cache = [];
          notify();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => {
      listeners = listeners.filter((fn) => fn !== update);
    };
  }, []);

  return { links, loading };
}
