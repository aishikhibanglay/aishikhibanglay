import { Router, type IRouter } from "express";
import { eq, and, ilike, or } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";
import {
  ListPostsResponse,
  GetPostResponse,
  GetPostBySlugResponse,
} from "@workspace/api-zod";
import { serializePost, serializePosts } from "../lib/serializePost";
import * as zod from "zod";

const ErrorResponse = zod.object({ error: zod.string() });

const router: IRouter = Router();

router.get("/posts", async (req, res): Promise<void> => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const { category, search } = req.query as { category?: string; search?: string };

  let posts;
  if (search && typeof search === "string") {
    posts = await db
      .select()
      .from(postsTable)
      .where(
        and(
          eq(postsTable.status, "published"),
          category && typeof category === "string" ? eq(postsTable.category, category) : undefined,
          or(
            ilike(postsTable.title, `%${search}%`),
            ilike(postsTable.excerpt, `%${search}%`)
          )
        )
      )
      .orderBy(postsTable.publishedAt);
  } else {
    const conditions = [eq(postsTable.status, "published")];
    if (category && typeof category === "string") {
      conditions.push(eq(postsTable.category, category));
    }
    posts = await db
      .select()
      .from(postsTable)
      .where(and(...conditions))
      .orderBy(postsTable.publishedAt);
  }

  res.json(ListPostsResponse.parse(serializePosts(posts)));
});

router.get("/posts/slug/:slug", async (req, res): Promise<void> => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

  const [post] = await db
    .select()
    .from(postsTable)
    .where(and(eq(postsTable.slug, slug), eq(postsTable.status, "published")));

  if (!post) {
    res.status(404).json(ErrorResponse.parse({ error: "Post not found" }));
    return;
  }

  res.json(GetPostBySlugResponse.parse(serializePost(post)));
});

router.get("/posts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json(ErrorResponse.parse({ error: "Invalid ID" }));
    return;
  }

  const [post] = await db
    .select()
    .from(postsTable)
    .where(and(eq(postsTable.id, id), eq(postsTable.status, "published")));

  if (!post) {
    res.status(404).json(ErrorResponse.parse({ error: "Post not found" }));
    return;
  }

  res.json(GetPostResponse.parse(serializePost(post)));
});

export default router;
