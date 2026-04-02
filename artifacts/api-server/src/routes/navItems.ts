import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, navItemsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import * as zod from "zod";

const router: IRouter = Router();

router.get("/nav-items", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(navItemsTable)
    .where(eq(navItemsTable.isActive, true))
    .orderBy(asc(navItemsTable.section), asc(navItemsTable.position));
  res.set("Cache-Control", "public, max-age=120, stale-while-revalidate=60");
  res.json(items);
});

router.get("/admin/nav-items", requireAdmin, async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(navItemsTable)
    .orderBy(asc(navItemsTable.section), asc(navItemsTable.position));
  res.json(items);
});

const NavItemBody = zod.object({
  label: zod.string().min(1),
  href: zod.string().min(1),
  section: zod.enum(["navbar", "footer_main", "footer_legal"]),
  position: zod.number().int().default(0),
  isActive: zod.boolean().default(true),
  openInNewTab: zod.boolean().default(false),
});

router.post("/admin/nav-items", requireAdmin, async (req, res): Promise<void> => {
  const parsed = NavItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(navItemsTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.put("/admin/nav-items/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = NavItemBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [item] = await db.update(navItemsTable).set(parsed.data).where(eq(navItemsTable.id, id)).returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.delete("/admin/nav-items/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(navItemsTable).where(eq(navItemsTable.id, id));
  res.json({ ok: true });
});

export default router;
