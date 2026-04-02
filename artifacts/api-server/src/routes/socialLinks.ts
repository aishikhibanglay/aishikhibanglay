import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { socialLinksTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

// Public: get all social links
router.get("/social-links", async (_req, res): Promise<void> => {
  try {
    const links = await db
      .select()
      .from(socialLinksTable)
      .orderBy(asc(socialLinksTable.displayOrder), asc(socialLinksTable.id));
    res.json(links);
  } catch {
    res.status(500).json({ error: "Failed to fetch social links" });
  }
});

// Admin: create a new social link
router.post("/admin/social-links", requireAdmin, async (req, res): Promise<void> => {
  const { label, url, icon, displayOrder } = req.body;
  if (!label || !url) {
    res.status(400).json({ error: "label and url are required" });
    return;
  }
  try {
    const [created] = await db
      .insert(socialLinksTable)
      .values({
        label: String(label),
        url: String(url),
        icon: String(icon ?? "link"),
        displayOrder: Number(displayOrder ?? 0),
      })
      .returning();
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Failed to create social link" });
  }
});

// Admin: update a social link
router.put("/admin/social-links/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { label, url, icon, displayOrder } = req.body;
  if (!label || !url) {
    res.status(400).json({ error: "label and url are required" });
    return;
  }
  try {
    const [updated] = await db
      .update(socialLinksTable)
      .set({
        label: String(label),
        url: String(url),
        icon: String(icon ?? "link"),
        displayOrder: Number(displayOrder ?? 0),
      })
      .where(eq(socialLinksTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update social link" });
  }
});

// Admin: delete a social link
router.delete("/admin/social-links/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  try {
    await db.delete(socialLinksTable).where(eq(socialLinksTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete social link" });
  }
});

export default router;
