import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq, and, desc, ilike, or, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  communityMembersTable,
  communityPostsTable,
  communityCommentsTable,
  communityVotesTable,
  communityFaqTable,
  communityWarningsTable,
  siteSettingsTable,
} from "@workspace/db";
import { pbkdf2Sync, randomBytes, timingSafeEqual, randomUUID } from "node:crypto";
import * as zod from "zod";

// Password helpers using Node.js built-in crypto (no external deps)
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const computed = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(computed, "hex"));
  } catch { return false; }
}

const router: IRouter = Router();

// ─── Token Auth Middleware ─────────────────────────────────────────────────────
async function getCommunityMember(token: string | undefined) {
  if (!token) return null;
  const rows = await db.select().from(communityMembersTable)
    .where(eq(communityMembersTable.sessionToken, token)).limit(1);
  if (!rows.length || rows[0].isBanned) return null;
  return rows[0];
}

function requireMember(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["x-community-token"] as string | undefined;
  getCommunityMember(token).then((member) => {
    if (!member) { res.status(401).json({ error: "로그인 প্রয়োজন" }); return; }
    (req as any).communityMember = member;
    next();
  });
}

function optionalMember(req: Request, _res: Response, next: NextFunction): void {
  const token = req.headers["x-community-token"] as string | undefined;
  getCommunityMember(token).then((member) => {
    (req as any).communityMember = member ?? null;
    next();
  });
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const RegisterBody = zod.object({
  username: zod.string().min(3).max(30).regex(/^[a-zA-Z0-9_\u0980-\u09FF ]+$/, "শুধু বাংলা/English/number দিন"),
  email: zod.string().email(),
  password: zod.string().min(6),
});

router.post("/community/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0].message }); return; }
  const { username, email, password } = parsed.data;

  const existing = await db.select().from(communityMembersTable)
    .where(or(eq(communityMembersTable.email, email), eq(communityMembersTable.username, username))).limit(1);
  if (existing.length) { res.status(400).json({ error: "এই ইমেইল বা username ইতোমধ্যে নিবন্ধিত" }); return; }

  const passwordHash = hashPassword(password);
  const sessionToken = randomUUID();
  const [member] = await db.insert(communityMembersTable).values({ username, email, passwordHash, sessionToken }).returning();
  res.json({ token: sessionToken, member: { id: member.id, username: member.username, email: member.email, isModerator: member.isModerator, joinedAt: member.joinedAt } });
});

const LoginBody = zod.object({ email: zod.string().email(), password: zod.string() });

router.post("/community/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "ইনপুট সঠিক নয়" }); return; }
  const { email, password } = parsed.data;

  const rows = await db.select().from(communityMembersTable).where(eq(communityMembersTable.email, email)).limit(1);
  if (!rows.length) { res.status(401).json({ error: "ইমেইল বা পাসওয়ার্ড ভুল" }); return; }
  const member = rows[0];
  if (member.isBanned) { res.status(403).json({ error: `আপনি ban হয়েছেন${member.bannedReason ? `: ${member.bannedReason}` : ""}` }); return; }

  const ok = verifyPassword(password, member.passwordHash);
  if (!ok) { res.status(401).json({ error: "ইমেইল বা পাসওয়ার্ড ভুল" }); return; }

  const sessionToken = randomUUID();
  await db.update(communityMembersTable).set({ sessionToken }).where(eq(communityMembersTable.id, member.id));
  res.json({ token: sessionToken, member: { id: member.id, username: member.username, email: member.email, isModerator: member.isModerator, warningCount: member.warningCount, joinedAt: member.joinedAt } });
});

router.get("/community/auth/me", requireMember, async (req, res): Promise<void> => {
  const m = (req as any).communityMember;
  res.json({ id: m.id, username: m.username, email: m.email, isModerator: m.isModerator, warningCount: m.warningCount, joinedAt: m.joinedAt });
});

router.post("/community/auth/logout", requireMember, async (req, res): Promise<void> => {
  const m = (req as any).communityMember;
  await db.update(communityMembersTable).set({ sessionToken: null }).where(eq(communityMembersTable.id, m.id));
  res.json({ ok: true });
});

// ─── POSTS ────────────────────────────────────────────────────────────────────
router.get("/community/posts", optionalMember, async (req, res): Promise<void> => {
  const { q, page = "1" } = req.query as { q?: string; page?: string };
  const limit = 15;
  const offset = (parseInt(page) - 1) * limit;
  const member = (req as any).communityMember;

  let query = db.select().from(communityPostsTable)
    .where(eq(communityPostsTable.status, "active"))
    .$dynamic();

  if (q) {
    query = query.where(and(
      eq(communityPostsTable.status, "active"),
      or(ilike(communityPostsTable.title, `%${q}%`), ilike(communityPostsTable.body, `%${q}%`))
    ));
  }

  const posts = await query.orderBy(desc(communityPostsTable.createdAt)).limit(limit).offset(offset);

  // Get vote status for logged-in member
  let votedPostIds: Set<number> = new Set();
  if (member) {
    const votes = await db.select().from(communityVotesTable)
      .where(eq(communityVotesTable.voterKey, `member:${member.id}`));
    votedPostIds = new Set(votes.map((v) => v.postId));
  }

  res.json(posts.map((p) => ({ ...p, hasVoted: votedPostIds.has(p.id) })));
});

const CreatePostBody = zod.object({
  title: zod.string().min(5).max(200),
  body: zod.string().min(10).max(5000),
});

router.post("/community/posts", requireMember, async (req, res): Promise<void> => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0].message }); return; }
  const m = (req as any).communityMember;
  const [post] = await db.insert(communityPostsTable).values({
    title: parsed.data.title,
    body: parsed.data.body,
    authorId: m.id,
    authorName: m.username,
  }).returning();
  res.json(post);
});

router.get("/community/posts/:id", optionalMember, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const rows = await db.select().from(communityPostsTable)
    .where(and(eq(communityPostsTable.id, id), eq(communityPostsTable.status, "active"))).limit(1);
  if (!rows.length) { res.status(404).json({ error: "পোস্ট পাওয়া যায়নি" }); return; }

  const comments = await db.select().from(communityCommentsTable)
    .where(and(eq(communityCommentsTable.postId, id), eq(communityCommentsTable.status, "active")))
    .orderBy(communityCommentsTable.createdAt);

  const member = (req as any).communityMember;
  let hasVoted = false;
  if (member) {
    const votes = await db.select().from(communityVotesTable)
      .where(and(eq(communityVotesTable.postId, id), eq(communityVotesTable.voterKey, `member:${member.id}`))).limit(1);
    hasVoted = votes.length > 0;
  }

  res.json({ post: { ...rows[0], hasVoted }, comments });
});

// ─── VOTE ─────────────────────────────────────────────────────────────────────
router.post("/community/posts/:id/vote", requireMember, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const m = (req as any).communityMember;
  const voterKey = `member:${m.id}`;

  const existing = await db.select().from(communityVotesTable)
    .where(and(eq(communityVotesTable.postId, id), eq(communityVotesTable.voterKey, voterKey))).limit(1);

  if (existing.length) {
    // Remove vote (toggle)
    await db.delete(communityVotesTable).where(eq(communityVotesTable.id, existing[0].id));
    await db.update(communityPostsTable).set({ voteCount: sql`vote_count - 1` }).where(eq(communityPostsTable.id, id));
    res.json({ voted: false });
  } else {
    await db.insert(communityVotesTable).values({ postId: id, voterKey, type: "up" });
    await db.update(communityPostsTable).set({ voteCount: sql`vote_count + 1` }).where(eq(communityPostsTable.id, id));
    res.json({ voted: true });
  }
});

// ─── COMMENTS ─────────────────────────────────────────────────────────────────
const CreateCommentBody = zod.object({
  body: zod.string().min(1).max(2000),
  parentId: zod.number().optional(),
});

router.post("/community/posts/:id/comments", requireMember, async (req, res): Promise<void> => {
  const postId = parseInt(req.params.id);
  const parsed = CreateCommentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0].message }); return; }
  const m = (req as any).communityMember;

  const [comment] = await db.insert(communityCommentsTable).values({
    postId,
    authorId: m.id,
    authorName: m.username,
    body: parsed.data.body,
    parentId: parsed.data.parentId ?? null,
  }).returning();

  await db.update(communityPostsTable).set({ commentCount: sql`comment_count + 1` }).where(eq(communityPostsTable.id, postId));
  res.json(comment);
});

router.delete("/community/comments/:id", requireMember, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const m = (req as any).communityMember;
  const rows = await db.select().from(communityCommentsTable).where(eq(communityCommentsTable.id, id)).limit(1);
  if (!rows.length) { res.status(404).json({ error: "পাওয়া যায়নি" }); return; }
  // Can delete own comment or if moderator
  if (rows[0].authorId !== m.id && !m.isModerator) { res.status(403).json({ error: "অনুমতি নেই" }); return; }
  await db.update(communityCommentsTable).set({ status: "deleted" }).where(eq(communityCommentsTable.id, id));
  await db.update(communityPostsTable).set({ commentCount: sql`comment_count - 1` }).where(eq(communityPostsTable.id, rows[0].postId));
  res.json({ ok: true });
});

// ─── COMMUNITY INFO ────────────────────────────────────────────────────────────
router.get("/community/info", async (_req, res): Promise<void> => {
  // Get rules from settings
  const rulesRow = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, "community_rules")).limit(1);
  const rules: string[] = rulesRow.length ? JSON.parse(rulesRow[0].value) : [];

  // Get moderators
  const mods = await db.select({
    id: communityMembersTable.id,
    username: communityMembersTable.username,
    joinedAt: communityMembersTable.joinedAt,
  }).from(communityMembersTable).where(eq(communityMembersTable.isModerator, true));

  // Get member count
  const countRows = await db.select({ count: sql<number>`count(*)` }).from(communityMembersTable)
    .where(eq(communityMembersTable.isBanned, false));
  const memberCount = Number(countRows[0]?.count ?? 0);

  res.json({ rules, moderators: mods, memberCount });
});

router.get("/community/faq", async (_req, res): Promise<void> => {
  const items = await db.select().from(communityFaqTable)
    .where(eq(communityFaqTable.isActive, true))
    .orderBy(communityFaqTable.displayOrder, communityFaqTable.createdAt);
  res.json(items);
});

export default router;
