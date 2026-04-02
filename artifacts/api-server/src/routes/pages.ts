import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, pagesTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import * as zod from "zod";

const router: IRouter = Router();

function makeBengaliSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u0980-\u09FF\w]+/g, (m) => m)
    .replace(/[^\u0980-\u09FF\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || `page-${Date.now()}`;
}

router.get("/pages/:slug", async (req, res): Promise<void> => {
  const { slug } = req.params;
  const [page] = await db
    .select()
    .from(pagesTable)
    .where(eq(pagesTable.slug, slug));
  if (!page || page.status !== "published") {
    res.status(404).json({ error: "Page not found" });
    return;
  }
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
  res.json(page);
});

router.get("/admin/pages", requireAdmin, async (_req, res): Promise<void> => {
  const pages = await db.select().from(pagesTable).orderBy(asc(pagesTable.createdAt));
  res.json(pages);
});

const PageBody = zod.object({
  title: zod.string().min(1),
  slug: zod.string().optional(),
  content: zod.string().default(""),
  metaDescription: zod.string().default(""),
  status: zod.enum(["draft", "published"]).default("draft"),
});

router.post("/admin/pages", requireAdmin, async (req, res): Promise<void> => {
  const parsed = PageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const slug = parsed.data.slug || makeBengaliSlug(parsed.data.title);
  const [page] = await db.insert(pagesTable).values({ ...parsed.data, slug }).returning();
  res.status(201).json(page);
});

router.put("/admin/pages/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = PageBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [page] = await db.update(pagesTable).set(parsed.data).where(eq(pagesTable.id, id)).returning();
  if (!page) { res.status(404).json({ error: "Not found" }); return; }
  res.json(page);
});

router.delete("/admin/pages/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(pagesTable).where(eq(pagesTable.id, id));
  res.json({ ok: true });
});

export default router;
