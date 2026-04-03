import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  communityMembersTable,
  communityPostsTable,
  communityCommentsTable,
  communityWarningsTable,
  communityFaqTable,
  communityVotesTable,
  siteSettingsTable,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import * as zod from "zod";

const router: IRouter = Router();

// ─── MEMBERS ──────────────────────────────────────────────────────────────────
router.get("/admin/community/members", requireAdmin, async (req, res): Promise<void> => {
  const members = await db.select({
    id: communityMembersTable.id,
    username: communityMembersTable.username,
    email: communityMembersTable.email,
    isBanned: communityMembersTable.isBanned,
    bannedReason: communityMembersTable.bannedReason,
    warningCount: communityMembersTable.warningCount,
    isModerator: communityMembersTable.isModerator,
    joinedAt: communityMembersTable.joinedAt,
  }).from(communityMembersTable).orderBy(desc(communityMembersTable.joinedAt));
  res.json(members);
});

// Warn a member
router.post("/admin/community/members/:id/warn", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { reason } = req.body as { reason?: string };
  if (!reason?.trim()) { res.status(400).json({ error: "কারণ দিন" }); return; }

  const rows = await db.select().from(communityMembersTable).where(eq(communityMembersTable.id, id)).limit(1);
  if (!rows.length) { res.status(404).json({ error: "সদস্য পাওয়া যায়নি" }); return; }

  await db.insert(communityWarningsTable).values({ memberId: id, reason, issuedBy: "admin" });
  const newCount = (rows[0].warningCount || 0) + 1;
  
  // Auto-ban at 3 warnings
  if (newCount >= 3) {
    await db.update(communityMembersTable).set({
      warningCount: newCount,
      isBanned: true,
      bannedReason: "৩টি সতর্কতার পরে স্বয়ংক্রিয়ভাবে ban",
      sessionToken: null,
    }).where(eq(communityMembersTable.id, id));
    res.json({ warned: true, autoBanned: true, warningCount: newCount });
  } else {
    await db.update(communityMembersTable).set({ warningCount: newCount }).where(eq(communityMembersTable.id, id));
    res.json({ warned: true, autoBanned: false, warningCount: newCount });
  }
});

// Ban a member
router.post("/admin/community/members/:id/ban", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { reason, unban } = req.body as { reason?: string; unban?: boolean };

  if (unban) {
    await db.update(communityMembersTable).set({ isBanned: false, bannedReason: null }).where(eq(communityMembersTable.id, id));
    res.json({ banned: false });
  } else {
    await db.update(communityMembersTable).set({
      isBanned: true,
      bannedReason: reason || "নিয়ম ভঙ্গ",
      sessionToken: null,
    }).where(eq(communityMembersTable.id, id));
    res.json({ banned: true });
  }
});

// Set/unset moderator
router.post("/admin/community/members/:id/moderator", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { isModerator } = req.body as { isModerator: boolean };
  await db.update(communityMembersTable).set({ isModerator: !!isModerator }).where(eq(communityMembersTable.id, id));
  res.json({ isModerator: !!isModerator });
});

// Get warnings for a member
router.get("/admin/community/members/:id/warnings", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const warnings = await db.select().from(communityWarningsTable)
    .where(eq(communityWarningsTable.memberId, id))
    .orderBy(desc(communityWarningsTable.createdAt));
  res.json(warnings);
});

// ─── POSTS ────────────────────────────────────────────────────────────────────
router.get("/admin/community/posts", requireAdmin, async (_req, res): Promise<void> => {
  const posts = await db.select().from(communityPostsTable)
    .orderBy(desc(communityPostsTable.createdAt)).limit(100);
  res.json(posts);
});

// Admin create announcement post
router.post("/admin/community/posts", requireAdmin, async (req, res): Promise<void> => {
  const { title, body } = req.body as { title: string; body: string };
  if (!title?.trim() || !body?.trim()) { res.status(400).json({ error: "শিরোনাম ও বিষয়বস্তু দিন" }); return; }
  const [post] = await db.insert(communityPostsTable).values({
    title,
    body,
    authorName: "Admin",
    isAdminPost: true,
  }).returning();
  res.json(post);
});

// Admin delete post
router.delete("/admin/community/posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.update(communityPostsTable).set({ status: "deleted" }).where(eq(communityPostsTable.id, id));
  res.json({ ok: true });
});

// Admin delete comment
router.delete("/admin/community/comments/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const rows = await db.select().from(communityCommentsTable).where(eq(communityCommentsTable.id, id)).limit(1);
  if (rows.length) {
    await db.update(communityCommentsTable).set({ status: "deleted" }).where(eq(communityCommentsTable.id, id));
    await db.update(communityPostsTable).set({ commentCount: sql`comment_count - 1` }).where(eq(communityPostsTable.id, rows[0].postId));
  }
  res.json({ ok: true });
});

// ─── RULES ────────────────────────────────────────────────────────────────────
router.get("/admin/community/rules", requireAdmin, async (_req, res): Promise<void> => {
  const row = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "community_rules")).limit(1);
  res.json({ rules: row.length ? JSON.parse(row[0].value) : [] });
});

router.put("/admin/community/rules", requireAdmin, async (req, res): Promise<void> => {
  const { rules } = req.body as { rules: string[] };
  if (!Array.isArray(rules)) { res.status(400).json({ error: "rules একটি array হতে হবে" }); return; }
  const value = JSON.stringify(rules.filter(Boolean));
  const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "community_rules")).limit(1);
  if (existing.length) {
    await db.update(siteSettingsTable).set({ value }).where(eq(siteSettingsTable.key, "community_rules"));
  } else {
    await db.insert(siteSettingsTable).values({ key: "community_rules", value });
  }
  res.json({ ok: true, rules: JSON.parse(value) });
});

// ─── COMMUNITY FAQ ─────────────────────────────────────────────────────────────
router.get("/admin/community/faq", requireAdmin, async (_req, res): Promise<void> => {
  const items = await db.select().from(communityFaqTable).orderBy(communityFaqTable.displayOrder);
  res.json(items);
});

const FaqBody = zod.object({
  question: zod.string().min(3),
  answer: zod.string().min(3),
  displayOrder: zod.number().optional(),
});

router.post("/admin/community/faq", requireAdmin, async (req, res): Promise<void> => {
  const parsed = FaqBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0].message }); return; }
  const [item] = await db.insert(communityFaqTable).values(parsed.data).returning();
  res.json(item);
});

router.put("/admin/community/faq/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const parsed = FaqBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0].message }); return; }
  const [item] = await db.update(communityFaqTable).set(parsed.data).where(eq(communityFaqTable.id, id)).returning();
  res.json(item);
});

router.delete("/admin/community/faq/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(communityFaqTable).where(eq(communityFaqTable.id, id));
  res.json({ ok: true });
});

// Toggle FAQ active
router.patch("/admin/community/faq/:id/toggle", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const rows = await db.select().from(communityFaqTable).where(eq(communityFaqTable.id, id)).limit(1);
  if (!rows.length) { res.status(404).json({ error: "পাওয়া যায়নি" }); return; }
  const [item] = await db.update(communityFaqTable).set({ isActive: !rows[0].isActive }).where(eq(communityFaqTable.id, id)).returning();
  res.json(item);
});

// ─── STATS ────────────────────────────────────────────────────────────────────
router.get("/admin/community/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [members, posts, bannedMembers] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(communityMembersTable),
    db.select({ count: sql<number>`count(*)` }).from(communityPostsTable).where(eq(communityPostsTable.status, "active")),
    db.select({ count: sql<number>`count(*)` }).from(communityMembersTable).where(eq(communityMembersTable.isBanned, true)),
  ]);
  res.json({
    memberCount: Number(members[0]?.count ?? 0),
    postCount: Number(posts[0]?.count ?? 0),
    bannedCount: Number(bannedMembers[0]?.count ?? 0),
  });
});

export default router;
