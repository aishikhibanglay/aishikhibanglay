import { useState, useEffect } from "react";

export interface SiteSettings {
  brand_name: string;
  logo_url: string;
  youtube_channel_url: string;
  youtube_subscribe_url: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  tiktok_url: string;
  featured_youtube_video_id: string;
  featured_youtube_videos: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_primary_href: string;
  hero_cta_secondary: string;
  hero_cta_secondary_href: string;
  newsletter_title: string;
  newsletter_subtitle: string;
  footer_description: string;
  footer_copyright: string;
  footer_tagline: string;
  footer_main_title: string;
  footer_legal_title: string;
  custom_head_script: string;
  blog_title: string;
  blog_subtitle: string;
  blog_categories: string;
  blog_sidebar_popular_enabled: string;
  blog_sidebar_popular_title: string;
  blog_sidebar_popular_count: string;
  blog_sidebar_categories_enabled: string;
  blog_sidebar_categories_title: string;
  blog_sidebar_newsletter_enabled: string;
  blog_sidebar_newsletter_title: string;
  blog_sidebar_newsletter_subtitle: string;
}

const defaultSettings: SiteSettings = {
  brand_name: "AI শিখি বাংলায়",
  logo_url: "",
  youtube_channel_url: "",
  youtube_subscribe_url: "",
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  tiktok_url: "",
  featured_youtube_video_id: "",
  featured_youtube_videos: "",
  hero_badge: "আপনার মাতৃভাষায় ভবিষ্যতের প্রযুক্তি",
  hero_title: "বাংলায় শিখুন AI",
  hero_subtitle: "কৃত্রিম বুদ্ধিমতার এই নতুন যুগে পিছিয়ে থাকবেন না। খুব সহজেই নিজের ভাষায় শিখুন AI-এর খুঁটিনাটি এবং কাজে লাগান দৈনন্দিন জীবনে।",
  hero_cta_primary: "শেখা শুরু করুন",
  hero_cta_primary_href: "/blog",
  hero_cta_secondary: "AI টুলস এক্সপ্লোর করুন",
  hero_cta_secondary_href: "/tools",
  newsletter_title: "আপডেট পেতে সাবস্ক্রাইব করুন",
  newsletter_subtitle: "নতুন ব্লগ পোস্ট ও AI আপডেট সরাসরি আপনার ইমেইলে পাঠাবো।",
  footer_description: "আপনার মাতৃভাষায় আর্টিফিশিয়াল ইন্টেলিজেন্স শেখার বিশ্বস্ত প্ল্যাটফর্ম। ভবিষ্যতের প্রযুক্তির সাথে তাল মিলিয়ে চলতে আমাদের সাথেই থাকুন।",
  footer_copyright: "AI শিখি বাংলায়। সর্বস্বত্ব সংরক্ষিত।",
  footer_tagline: "তৈরি করা হয়েছে ভালোবাসার সাথে, বাংলাদেশের জন্য।",
  footer_main_title: "গুরুত্বপূর্ণ পেজ",
  footer_legal_title: "আইনি তথ্য",
  custom_head_script: "",
  blog_title: "আমাদের ব্লগ",
  blog_subtitle: "AI দুনিয়ার সর্বশেষ খবর, টিউটোরিয়াল এবং গাইডলাইন বাংলায় পড়তে আমাদের ব্লগগুলো এক্সপ্লোর করুন।",
  blog_categories: JSON.stringify(["টিউটোরিয়াল", "টুলস", "Prompt", "আয়", "নিউজ"]),
  blog_sidebar_popular_enabled: "true",
  blog_sidebar_popular_title: "🔥 জনপ্রিয় পোস্ট",
  blog_sidebar_popular_count: "5",
  blog_sidebar_categories_enabled: "true",
  blog_sidebar_categories_title: "📂 ক্যাটাগরি",
  blog_sidebar_newsletter_enabled: "true",
  blog_sidebar_newsletter_title: "📬 নিউজলেটার",
  blog_sidebar_newsletter_subtitle: "নতুন পোস্ট সরাসরি ইমেইলে পান",
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
