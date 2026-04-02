import { Router } from "express";
import { db, pageViewsTable, postsTable, subscribersTable } from "@workspace/db";
import { aiToolsTable } from "@workspace/db/schema";
import { count, eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

router.post("/views", async (req, res): Promise<void> => {
  try {
    const path = typeof req.body?.path === "string" ? req.body.path.slice(0, 500) : "/";
    await db.insert(pageViewsTable).values({ path });
    res.status(201).json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to track view" });
  }
});

// Public stats — no auth needed (shows counts for homepage social proof)
router.get("/stats", async (_req, res): Promise<void> => {
  try {
    const [[views], [posts], [tools], [subscribers]] = await Promise.all([
      db.select({ total: count() }).from(pageViewsTable),
      db.select({ total: count() }).from(postsTable).where(eq(postsTable.status, "published")),
      db.select({ total: count() }).from(aiToolsTable).where(eq(aiToolsTable.isActive, true)),
      db.select({ total: count() }).from(subscribersTable),
    ]);
    res.json({
      visitors: views?.total ?? 0,
      posts: posts?.total ?? 0,
      tools: tools?.total ?? 0,
      subscribers: subscribers?.total ?? 0,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  try {
    const [views] = await db.select({ total: count() }).from(pageViewsTable);
    res.json({ totalViews: views?.total ?? 0 });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
