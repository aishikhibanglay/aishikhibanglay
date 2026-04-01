import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";
import {
  AdminListPostsResponse,
  AdminGetPostResponse,
  AdminCreatePostBody,
  AdminUpdatePostBody,
  AdminUpdatePostResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { serializePost, serializePosts } from "../lib/serializePost";
import * as zod from "zod";

const ErrorResponse = zod.object({ error: zod.string() });

const router: IRouter = Router();

router.use(requireAdmin);

router.get("/admin/posts", async (req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(postsTable)
    .orderBy(postsTable.createdAt);

  res.json(AdminListPostsResponse.parse(serializePosts(posts)));
});

router.get("/admin/posts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json(ErrorResponse.parse({ error: "Invalid ID" }));
    return;
  }

  const [post] = await db.select().from(postsTable).where(eq(postsTable.id, id));

  if (!post) {
    res.status(404).json(ErrorResponse.parse({ error: "Post not found" }));
    return;
  }

  res.json(AdminGetPostResponse.parse(serializePost(post)));
});

router.post("/admin/posts", async (req, res): Promise<void> => {
  const parsed = AdminCreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(ErrorResponse.parse({ error: parsed.error.message }));
    return;
  }

  const { status, ...rest } = parsed.data;
  const publishedAt = status === "published" ? new Date() : null;

  const [post] = await db
    .insert(postsTable)
    .values({ ...rest, status, publishedAt })
    .returning();

  res.status(201).json(AdminGetPostResponse.parse(serializePost(post)));
});

router.put("/admin/posts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json(ErrorResponse.parse({ error: "Invalid ID" }));
    return;
  }

  const parsed = AdminUpdatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(ErrorResponse.parse({ error: parsed.error.message }));
    return;
  }

  const existing = await db.select().from(postsTable).where(eq(postsTable.id, id));
  if (!existing.length) {
    res.status(404).json(ErrorResponse.parse({ error: "Post not found" }));
    return;
  }

  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "published" && existing[0].status !== "published") {
    updateData.publishedAt = new Date();
  }

  const [post] = await db
    .update(postsTable)
    .set(updateData)
    .where(eq(postsTable.id, id))
    .returning();

  res.json(AdminUpdatePostResponse.parse(serializePost(post)));
});

router.delete("/admin/posts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json(ErrorResponse.parse({ error: "Invalid ID" }));
    return;
  }

  const [deleted] = await db.delete(postsTable).where(eq(postsTable.id, id)).returning();

  if (!deleted) {
    res.status(404).json(ErrorResponse.parse({ error: "Post not found" }));
    return;
  }

  res.sendStatus(204);
});

export default router;
