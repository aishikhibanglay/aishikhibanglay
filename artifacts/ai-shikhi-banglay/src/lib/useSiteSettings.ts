import { useState, useEffect } from "react";

export interface SiteSettings {
  youtube_channel_url: string;
  youtube_subscribe_url: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  tiktok_url: string;
  featured_youtube_video_id: string;
}

const defaultSettings: SiteSettings = {
  youtube_channel_url: "",
  youtube_subscribe_url: "",
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  tiktok_url: "",
  featured_youtube_video_id: "",
};

let cachedSettings: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;

async function fetchSettings(): Promise<SiteSettings> {
  if (cachedSettings) return cachedSettings;
  if (!fetchPromise) {
    fetchPromise = fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        cachedSettings = { ...defaultSettings, ...data };
        return cachedSettings!;
      })
      .catch(() => defaultSettings);
  }
  return fetchPromise;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings ?? defaultSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }
    fetchSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}

export function invalidateSettingsCache() {
  cachedSettings = null;
  fetchPromise = null;
}
