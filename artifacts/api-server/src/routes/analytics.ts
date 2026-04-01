import { Router } from "express";
import { db, pageViewsTable } from "@workspace/db";
import { count } from "drizzle-orm";
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

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  try {
    const [views] = await db.select({ total: count() }).from(pageViewsTable);
    res.json({ totalViews: views?.total ?? 0 });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
