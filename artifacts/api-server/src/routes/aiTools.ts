import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { aiToolsTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

// Seed default tools if table is empty
const DEFAULT_TOOLS = [
  {
    name: "ChatGPT", company: "OpenAI", badge: "Free / Paid", rating: 5.0,
    description: "সবচেয়ে জনপ্রিয় এআই চ্যাটবট। টেক্সট লেখা, কোডিং করা, অনুবাদ করা থেকে শুরু করে যেকোনো প্রশ্নের উত্তর দিতে সক্ষম।",
    websiteUrl: "https://chat.openai.com",
    gradientClass: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400",
    displayOrder: 1, isActive: true,
  },
  {
    name: "Google Gemini", company: "Google", badge: "Free", rating: 4.5,
    description: "গুগলের শক্তিশালী এআই মডেল। রিয়েল-টাইম তথ্যের জন্য সেরা। এর সাথে গুগল ডক্স এবং জিমেইল ইন্টিগ্রেশন রয়েছে।",
    websiteUrl: "https://gemini.google.com",
    gradientClass: "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400",
    displayOrder: 2, isActive: true,
  },
  {
    name: "Claude", company: "Anthropic", badge: "Free / Paid", rating: 4.5,
    description: "নিরাপদ এবং অত্যন্ত বুদ্ধিমান এআই অ্যাসিস্ট্যান্ট। বড় ডকুমেন্ট পড়া এবং সামারাইজ করার জন্য চ্যাটজিপিটির চেয়েও ভালো।",
    websiteUrl: "https://claude.ai",
    gradientClass: "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400",
    displayOrder: 3, isActive: true,
  },
  {
    name: "Midjourney", company: "Midjourney Inc.", badge: "Paid", rating: 5.0,
    description: "টেক্সট থেকে হাই-কোয়ালিটি ছবি তৈরি করার সেরা টুল। প্রফেশনাল গ্রাফিক্স এবং আর্টওয়ার্ক তৈরির জন্য অতুলনীয়।",
    websiteUrl: "https://www.midjourney.com",
    gradientClass: "bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-purple-400",
    displayOrder: 4, isActive: true,
  },
  {
    name: "Perplexity AI", company: "Perplexity", badge: "Free / Paid", rating: 4.0,
    description: "এআই চালিত সার্চ ইঞ্জিন। যেকোনো প্রশ্নের সুনির্দিষ্ট উত্তর দেয় এবং সাথে সোর্স লিঙ্ক যুক্ত করে দেয়। রিসার্চের জন্য সেরা।",
    websiteUrl: "https://www.perplexity.ai",
    gradientClass: "bg-gradient-to-br from-cyan-500/20 to-sky-500/20 text-cyan-400",
    displayOrder: 5, isActive: true,
  },
  {
    name: "ElevenLabs", company: "ElevenLabs", badge: "Free / Paid", rating: 4.0,
    description: "টেক্সট থেকে মানুষের মতো বাস্তব ভয়েস তৈরি করার টুল। ভিডিওর জন্য প্রফেশনাল ভয়েসওভার বানাতে দারুণ কার্যকরী।",
    websiteUrl: "https://elevenlabs.io",
    gradientClass: "bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-400",
    displayOrder: 6, isActive: true,
  },
];

async function seedIfEmpty() {
  const existing = await db.select().from(aiToolsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(aiToolsTable).values(DEFAULT_TOOLS);
  }
}

// Public: get all active tools
router.get("/tools-data", async (_req, res): Promise<void> => {
  try {
    await seedIfEmpty();
    const tools = await db
      .select()
      .from(aiToolsTable)
      .where(eq(aiToolsTable.isActive, true))
      .orderBy(asc(aiToolsTable.displayOrder), asc(aiToolsTable.id));
    res.json(tools);
  } catch {
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

// Admin: get all tools (including inactive)
router.get("/admin/tools", requireAdmin, async (_req, res): Promise<void> => {
  try {
    await seedIfEmpty();
    const tools = await db
      .select()
      .from(aiToolsTable)
      .orderBy(asc(aiToolsTable.displayOrder), asc(aiToolsTable.id));
    res.json(tools);
  } catch {
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

// Admin: create a tool
router.post("/admin/tools", requireAdmin, async (req, res): Promise<void> => {
  const { name, company, badge, rating, description, websiteUrl, gradientClass, displayOrder, isActive } = req.body;
  if (!name) { res.status(400).json({ error: "name is required" }); return; }
  try {
    const [created] = await db.insert(aiToolsTable).values({
      name: String(name),
      company: String(company ?? ""),
      badge: String(badge ?? "Free"),
      rating: Number(rating ?? 4.0),
      description: String(description ?? ""),
      websiteUrl: String(websiteUrl ?? ""),
      gradientClass: String(gradientClass ?? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400"),
      displayOrder: Number(displayOrder ?? 0),
      isActive: isActive !== false,
    }).returning();
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Failed to create tool" });
  }
});

// Admin: update a tool
router.put("/admin/tools/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { name, company, badge, rating, description, websiteUrl, gradientClass, displayOrder, isActive } = req.body;
  if (!name) { res.status(400).json({ error: "name is required" }); return; }
  try {
    const [updated] = await db.update(aiToolsTable).set({
      name: String(name),
      company: String(company ?? ""),
      badge: String(badge ?? "Free"),
      rating: Number(rating ?? 4.0),
      description: String(description ?? ""),
      websiteUrl: String(websiteUrl ?? ""),
      gradientClass: String(gradientClass ?? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400"),
      displayOrder: Number(displayOrder ?? 0),
      isActive: isActive !== false,
    }).where(eq(aiToolsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update tool" });
  }
});

// Admin: delete a tool
router.delete("/admin/tools/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  try {
    await db.delete(aiToolsTable).where(eq(aiToolsTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete tool" });
  }
});

export default router;
