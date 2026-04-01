import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import * as zod from "zod";

const ErrorResponse = zod.object({ error: zod.string() });

const DEFAULT_SETTINGS: Record<string, string> = {
  youtube_channel_url: "",
  youtube_subscribe_url: "",
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  tiktok_url: "",
  featured_youtube_video_id: "",
};

const router: IRouter = Router();

router.get("/settings", async (_req, res): Promise<void> => {
  const rows = await db.select().from(siteSettingsTable);
  const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

const UpdateSettingsBody = zod.object({
  youtube_channel_url: zod.string().optional(),
  youtube_subscribe_url: zod.string().optional(),
  facebook_url: zod.string().optional(),
  twitter_url: zod.string().optional(),
  instagram_url: zod.string().optional(),
  tiktok_url: zod.string().optional(),
  featured_youtube_video_id: zod.string().optional(),
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
