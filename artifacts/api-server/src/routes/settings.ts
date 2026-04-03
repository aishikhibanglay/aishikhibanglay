import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import * as zod from "zod";

const ErrorResponse = zod.object({ error: zod.string() });

const DEFAULT_SETTINGS: Record<string, string> = {
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
  // Blog page settings
  blog_title: "আমাদের ব্লগ",
  blog_subtitle: "AI দুনিয়ার সর্বশেষ খবর, টিউটোরিয়াল এবং গাইডলাইন বাংলায় পড়তে আমাদের ব্লগগুলো এক্সপ্লোর করুন।",
  blog_categories: JSON.stringify(["টিউটোরিয়াল", "টুলস", "Prompt", "আয়", "নিউজ"]),
  // Blog sidebar settings
  blog_sidebar_popular_enabled: "true",
  blog_sidebar_popular_title: "🔥 জনপ্রিয় পোস্ট",
  blog_sidebar_popular_count: "5",
  blog_sidebar_categories_enabled: "true",
  blog_sidebar_categories_title: "📂 ক্যাটাগরি",
  blog_sidebar_newsletter_enabled: "true",
  blog_sidebar_newsletter_title: "📬 নিউজলেটার",
  blog_sidebar_newsletter_subtitle: "নতুন পোস্ট সরাসরি ইমেইলে পান",
};

const router: IRouter = Router();

router.get("/settings", async (_req, res): Promise<void> => {
  const rows = await db.select().from(siteSettingsTable);
  const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.set("Cache-Control", "public, max-age=120, stale-while-revalidate=60");
  res.json(settings);
});

const UpdateSettingsBody = zod.object({
  brand_name: zod.string().optional(),
  logo_url: zod.string().optional(),
  youtube_channel_url: zod.string().optional(),
  youtube_subscribe_url: zod.string().optional(),
  facebook_url: zod.string().optional(),
  twitter_url: zod.string().optional(),
  instagram_url: zod.string().optional(),
  tiktok_url: zod.string().optional(),
  featured_youtube_video_id: zod.string().optional(),
  featured_youtube_videos: zod.string().optional(),
  hero_badge: zod.string().optional(),
  hero_title: zod.string().optional(),
  hero_subtitle: zod.string().optional(),
  hero_cta_primary: zod.string().optional(),
  hero_cta_primary_href: zod.string().optional(),
  hero_cta_secondary: zod.string().optional(),
  hero_cta_secondary_href: zod.string().optional(),
  newsletter_title: zod.string().optional(),
  newsletter_subtitle: zod.string().optional(),
  footer_description: zod.string().optional(),
  footer_copyright: zod.string().optional(),
  footer_tagline: zod.string().optional(),
  footer_main_title: zod.string().optional(),
  footer_legal_title: zod.string().optional(),
  custom_head_script: zod.string().optional(),
  blog_title: zod.string().optional(),
  blog_subtitle: zod.string().optional(),
  blog_categories: zod.string().optional(),
  blog_sidebar_popular_enabled: zod.string().optional(),
  blog_sidebar_popular_title: zod.string().optional(),
  blog_sidebar_popular_count: zod.string().optional(),
  blog_sidebar_categories_enabled: zod.string().optional(),
  blog_sidebar_categories_title: zod.string().optional(),
  blog_sidebar_newsletter_enabled: zod.string().optional(),
  blog_sidebar_newsletter_title: zod.string().optional(),
  blog_sidebar_newsletter_subtitle: zod.string().optional(),
});

router.put("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(ErrorResponse.parse({ error: parsed.error.message }));
    return;
  }

  for (const [key, value] of Object.entries(parsed.data)) {
    if (value === undefined) continue;
    const existing = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.key, key));

    if (existing.length > 0) {
      await db
        .update(siteSettingsTable)
        .set({ value })
        .where(eq(siteSettingsTable.key, key));
    } else {
      await db.insert(siteSettingsTable).values({ key, value });
    }
  }

  const rows = await db.select().from(siteSettingsTable);
  const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

export default router;
