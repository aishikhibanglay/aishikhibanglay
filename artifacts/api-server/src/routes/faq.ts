import { Router, type IRouter } from "express";
import { db, pool } from "@workspace/db";
import { faqItemsTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

// Auto-create table if missing (handles fresh Supabase / new deployments)
async function ensureTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS faq_items (
      id        serial PRIMARY KEY,
      question  text    NOT NULL,
      answer    text    NOT NULL,
      category  text    NOT NULL DEFAULT 'general',
      display_order integer NOT NULL DEFAULT 0,
      is_active boolean NOT NULL DEFAULT true
    )
  `);
}

// Run once at startup
ensureTable().catch((err) => console.error("[faq] ensureTable error:", err));

const DEFAULT_FAQS = [
  { question: '"AI শিখি বাংলায়" আসলে কী?', answer: '"AI শিখি বাংলায়" হলো বাংলাদেশের প্রথম পূর্ণাঙ্গ বাংলা ভাষার AI শিক্ষা প্ল্যাটফর্ম। এখানে তুমি Artificial Intelligence, ChatGPT, Machine Learning, Prompt Engineering সহ আধুনিক AI technology সম্পূর্ণ বাংলায় শিখতে পারবে — একদম শূন্য থেকে শুরু করে Advanced level পর্যন্ত।', category: "general", displayOrder: 1, isActive: true },
  { question: "এই প্ল্যাটফর্ম কাদের জন্য তৈরি?", answer: "এই প্ল্যাটফর্ম সবার জন্য — কোনো পূর্ব অভিজ্ঞতা লাগবে না। বিশেষভাবে উপকারী: Students যারা AI career গড়তে চাও, Professionals যারা কাজে AI যোগ করতে চাও, Freelancers যারা AI services দিতে চাও, Business owners যারা ব্যবসায় AI ব্যবহার করতে চাও, এবং শিক্ষক যারা AI নিয়ে সচেতনতা বাড়াতে চাও।", category: "general", displayOrder: 2, isActive: true },
  { question: "AI শিখতে কি গণিত বা Coding জানা লাগবে?", answer: "একদমই না! আমাদের Beginner courses শুরু হয় একদম শূন্য থেকে — কোনো coding বা advanced math জানা ছাড়াই। Intermediate এবং Advanced levels এ ধীরে ধীরে technical বিষয়গুলো পরিচয় করিয়ে দেওয়া হয়। তোমার শেখার গতিতে, তোমার মতো করে।", category: "general", displayOrder: 3, isActive: true },
  { question: "কোর্সগুলো কি সত্যিই সম্পূর্ণ বাংলায়?", answer: "হ্যাঁ! সকল ভিডিও লেকচার, নোটস, Quiz, এবং Support — সবই বাংলায়। Technical terms এর ক্ষেত্রে বাংলা explanation এর পাশাপাশি ইংরেজি term উল্লেখ করা হয়, যাতে ভবিষ্যতে global resources ব্যবহার করতে অসুবিধা না হয়।", category: "general", displayOrder: 4, isActive: true },
  { question: "Mobile দিয়ে কি কোর্স করা যাবে?", answer: "অবশ্যই! আমাদের প্ল্যাটফর্ম সম্পূর্ণ Mobile Responsive। Android ও iOS উভয় ডিভাইস থেকেই ভিডিও দেখা, Quiz দেওয়া, এবং কমিউনিটিতে অংশ নেওয়া যাবে। ভবিষ্যতে আমাদের Dedicated Mobile App আসছে।", category: "general", displayOrder: 5, isActive: true },
  { question: "বাংলাদেশের বাইরে থেকেও কি Enroll করা যাবে?", answer: "হ্যাঁ! বিশ্বের যেকোনো প্রান্ত থেকে যে কেউ Enroll করতে পারবে। প্রবাসী বাংলাদেশি এবং Bengali speaking learners সবার জন্যই এই প্ল্যাটফর্ম উন্মুক্ত। International payment methods (Visa, Mastercard, PayPal) সাপোর্ট করা হয়।", category: "general", displayOrder: 6, isActive: true },
  { question: "কোন কোন বিষয়ের কোর্স পাওয়া যাবে?", answer: "আমাদের কোর্স তালিকায় রয়েছে:\n• ChatGPT & Prompt Engineering (Beginner to Advanced)\n• AI Image Generation (Midjourney, DALL-E, Stable Diffusion)\n• AI Video Creation (Runway, Pika, Sora)\n• AI for Business & Marketing\n• AI Coding Assistant (GitHub Copilot, Cursor)\n• Machine Learning Basics\n• Deep Learning Introduction\n• AI Freelancing Masterclass", category: "course", displayOrder: 7, isActive: true },
  { question: "একটি কোর্স শেষ করতে কতদিন লাগে?", answer: "কোর্সের ধরন অনুযায়ী সময় আলাদা:\n• Short Course: ৩–৭ দিন (প্রতিদিন ৩০ মিনিট)\n• Standard Course: ৩–৪ সপ্তাহ (প্রতিদিন ১ ঘণ্টা)\n• Comprehensive Course: ৬–৮ সপ্তাহ (প্রতিদিন ১–২ ঘণ্টা)\n\nতোমার নিজের pace এ শেখো — কোনো deadline নেই। Lifetime access থাকবে।", category: "course", displayOrder: 8, isActive: true },
  { question: "কোর্স Enroll করার পর কতদিন Access থাকবে?", answer: "Lifetime Access! একবার কোর্স কিনলে সারাজীবনের জন্য তোমার। কোর্সে নতুন content যোগ হলে সেটাও বিনামূল্যে পাবে। আমরা নিয়মিত কোর্স আপডেট করি AI এর নতুন developments অনুযায়ী।", category: "course", displayOrder: 9, isActive: true },
  { question: "কোর্স কি Live নাকি Recorded?", answer: "দুটোই আছে! বেশিরভাগ কোর্স Pre-recorded — যাতে তুমি নিজের সময় মতো শিখতে পারো। এর পাশাপাশি প্রতি মাসে Live Masterclass, Q&A Session, এবং Workshop হয় — যেগুলো পরে Recording হিসেবেও দেখা যায়।", category: "course", displayOrder: 10, isActive: true },
  { question: "ফ্রিতে কি কিছু শেখার সুযোগ আছে?", answer: "হ্যাঁ! আমাদের Free tier এ রয়েছে:\n• প্রতিটি কোর্সের প্রথম ২–৩টি লেকচার বিনামূল্যে\n• Weekly Free Webinar\n• AI Blog ও Resource Library\n• Community Forum এ অংশগ্রহণ\n• Monthly Newsletter", category: "course", displayOrder: 11, isActive: true },
  { question: "কোর্সে কি Practical Project করার সুযোগ আছে?", answer: "অবশ্যই! প্রতিটি কোর্সে রয়েছে:\n• Hands-on Exercises প্রতিটি লেকচারের পর\n• Mini Projects প্রতিটি module শেষে\n• Final Capstone Project কোর্স শেষে\n• Portfolio তৈরিতে সাহায্য", category: "course", displayOrder: 12, isActive: true },
  { question: "Course Materials কি Download করা যাবে?", answer: "হ্যাঁ! Paid courses এ নিম্নলিখিত সবকিছু Download করা যাবে:\n• PDF Notes ও Cheat Sheets\n• Slides ও Infographics\n• Exercise Files ও Templates\n• Audio Version (পথে চলতে চলতে শোনার জন্য)\n\nতবে ভিডিও download করা যাবে না — platform এই stream করতে হবে।", category: "course", displayOrder: 13, isActive: true },
  { question: "কোর্সের দাম কত?", answer: "বিভিন্ন কোর্সের মূল্য আলাদা:\n• Short Courses: ৩৯৯ – ৭৯৯ টাকা\n• Standard Courses: ৯৯৯ – ১,৯৯৯ টাকা\n• Comprehensive Courses: ২,৪৯৯ – ৪,৯৯৯ টাকা\n• All-Access Membership: ৭৯৯ টাকা/মাস\n\nনিয়মিত Discount এবং Bundle offer পাওয়া যায়। Newsletter subscribe করলে first notification পাবে।", category: "payment", displayOrder: 14, isActive: true },
  { question: "কোন কোন Payment Method সাপোর্ট করে?", answer: "বাংলাদেশের জনপ্রিয় সকল পেমেন্ট পদ্ধতি সাপোর্ট করা হয়:\n• bKash, Nagad, Rocket\n• Visa, Mastercard (Debit ও Credit)\n• Internet Banking (DBBL, Dutch Bangla, BRAC Bank)\n• PayPal (International users এর জন্য)", category: "payment", displayOrder: 15, isActive: true },
  { question: "Refund Policy কী? টাকা ফেরত পাওয়া যাবে?", answer: "আমাদের 7-Day Money Back Guarantee আছে। কোর্স কেনার ৭ দিনের মধ্যে যদি সন্তুষ্ট না হও, সম্পূর্ণ টাকা ফেরত দেওয়া হবে — কোনো প্রশ্ন ছাড়া। তবে কোর্সের ৩০% এর বেশি সম্পন্ন করলে Refund প্রযোজ্য হবে না।", category: "payment", displayOrder: 16, isActive: true },
  { question: "Student বা কম আয়ের মানুষদের জন্য কি বিশেষ সুবিধা আছে?", answer: "হ্যাঁ! আমরা বিশ্বাস করি অর্থের অভাব যেন শেখার বাধা না হয়। তাই রয়েছে:\n• Student Discount: ৪০% ছাড় (Student ID দেখালে)\n• Need-based Scholarship: আবেদন করলে বিনামূল্যে access\n• Installment Plan: ৩ মাসে ভাগে পেমেন্ট\n• Earn to Learn: Community contribute করে free access পাও", category: "payment", displayOrder: 17, isActive: true },
  { question: "Group বা Corporate Enrollment এর কোনো সুবিধা আছে?", answer: "অবশ্যই! Team বা Organization এর জন্য আলাদা Corporate Plan আছে:\n• ৫+ জনের জন্য: ২৫% ছাড়\n• ১০+ জনের জন্য: ৪০% ছাড়\n• ২০+ জনের জন্য: Custom pricing\n\nCorporate enquiry: corporate@aishikhibanglay.com", category: "payment", displayOrder: 18, isActive: true },
  { question: "কোর্স করতে কি Special Software বা Hardware লাগবে?", answer: "না! বেশিরভাগ কোর্স শুধু Browser দিয়েই করা যাবে। কিছু Advanced কোর্সের জন্য Google Colab (Free, browser-based) ব্যবহার করা হয়।\n\nMinimum requirement: যেকোনো smartphone বা computer + stable internet connection।", category: "technical", displayOrder: 19, isActive: true },
  { question: "Video quality কেমন? Slow internet এ কি দেখা যাবে?", answer: "সকল ভিডিও HD (720p ও 1080p) quality তে available। তবে আমরা বাংলাদেশের internet reality মাথায় রেখে:\n• Auto quality adjustment — connection অনুযায়ী automatic\n• Low-data mode: ৩৬০p option available\n• Pause & Resume: যেখানে ছেড়ে দেবে সেখান থেকে শুরু হবে", category: "technical", displayOrder: 20, isActive: true },
  { question: "Platform এ Login করতে সমস্যা হলে কী করবো?", answer: "প্রথমে এগুলো চেষ্টা করো:\n• \"Forgot Password\" দিয়ে password reset করো\n• Browser cache clear করো\n• অন্য browser বা device try করো\n\nসমস্যা থাকলে আমাদের WhatsApp Support এ যোগাযোগ করো — সাধারণত ২ ঘণ্টার মধ্যে reply পাবে।", category: "technical", displayOrder: 21, isActive: true },
  { question: "একই Account কি একাধিক Device এ ব্যবহার করা যাবে?", answer: "হ্যাঁ, তবে সীমিতভাবে। একটি Account একসাথে সর্বোচ্চ ২টি Device এ active থাকতে পারবে (যেমন: mobile + laptop)। Account sharing বা বিক্রি Terms of Service লঙ্ঘন — এটি করলে account suspend হতে পারে।", category: "technical", displayOrder: 22, isActive: true },
  { question: "আমার Progress কি Save হয়?", answer: "হ্যাঁ, সম্পূর্ণ automatically! তুমি যেখানে ভিডিও থামাবে, পরের বার সেখান থেকে শুরু হবে। Quiz scores, completed lessons, notes — সবকিছু cloud এ save থাকে। Dashboard এ গেলে তোমার পুরো learning journey দেখতে পাবে।", category: "technical", displayOrder: 23, isActive: true },
  { question: "কোর্স শেষে কি Certificate পাওয়া যাবে?", answer: "হ্যাঁ! সকল Paid কোর্স সফলভাবে সম্পন্ন করলে Digital Certificate পাবে। Certificate এ থাকবে:\n• তোমার নাম ও কোর্সের নাম\n• Completion date\n• Unique verification code\n• LinkedIn এ direct share করার option", category: "course", displayOrder: 24, isActive: true },
  { question: "Certificate টি কি Job এ কাজে লাগবে?", answer: "আমাদের Certificate বাংলাদেশের IT sector এ স্বীকৃত। তবে সবচেয়ে গুরুত্বপূর্ণ হলো তোমার শেখা skills — Certificate শুধু সেটাকে প্রমাণ করে। Capstone Project থেকে তৈরি Portfolio অনেক বেশি কার্যকর job পেতে।", category: "course", displayOrder: 25, isActive: true },
  { question: "AI শিখলে কত টাকা Earn করা সম্ভব?", answer: "Skill এবং dedication অনুযায়ী ভিন্ন হবে:\n• Entry-level AI Freelancing: ২০,০০০ – ৫০,০০০ টাকা/মাস\n• Intermediate (৬ মাস পর): ৫০,০০০ – ১,৫০,০০০ টাকা/মাস\n• Advanced + International clients: $500–$3000/মাস\n\nএই সংখ্যাগুলো guarantee না — তোমার effort এর উপর নির্ভর করে।", category: "career", displayOrder: 26, isActive: true },
  { question: "Job Placement বা Internship এ সাহায্য করা হয় কি?", answer: "হ্যাঁ! আমাদের Career Support Services এ রয়েছে:\n• CV Review ও LinkedIn Profile Optimization\n• Partner companies তে Job Referral\n• Internship opportunity announcements\n• Mock Interview preparation\n• Exclusive Job Board (শুধু আমাদের students এর জন্য)", category: "career", displayOrder: 27, isActive: true },
  { question: "Freelancing শুরু করতে কোন কোর্সটা আগে করবো?", answer: "AI Freelancing এ নতুনদের জন্য suggested path:\n1. ChatGPT & Prompt Engineering (Beginner)\n2. AI Image Generation (যদি creative field হয়)\n3. AI Freelancing Masterclass\n4. Portfolio Building Workshop\n\nএই path টা follow করলে ৬০–৯০ দিনে প্রথম client পাওয়ার সম্ভাবনা তৈরি হয়।", category: "career", displayOrder: 28, isActive: true },
  { question: "কোনো প্রশ্ন থাকলে কিভাবে সাহায্য পাবো?", answer: "আমাদের Multi-channel Support System রয়েছে:\n• Course Discussion Board — প্রতিটি লেকচারের নিচে\n• WhatsApp Support Group — quick questions এর জন্য\n• Email Support — complex issues এর জন্য (২৪ ঘণ্টায় reply)\n• Live Q&A — প্রতি সপ্তাহে ২ বার", category: "community", displayOrder: 29, isActive: true },
  { question: "Community তে কি ধরনের মানুষ আছে?", answer: "আমাদের community তে আছে ১০,০০০+ এর বেশি শিক্ষার্থী — students থেকে শুরু করে professionals, freelancers, এবং entrepreneurs। এখানে তুমি পাবে Accountability Partners, Project Collaboration সুযোগ, Success Stories ও Inspiration এবং Network তৈরির সুযোগ।", category: "community", displayOrder: 30, isActive: true },
  { question: "Instructor রা কে? তারা কি Qualified?", answer: "আমাদের instructors হলেন প্রকৃত practitioners — যারা নিজেরাই AI দিয়ে কাজ করেন। প্রতিটি instructor কে যাচাই করা হয়:\n• মিনিমাম ২ বছরের Real-world AI experience\n• Teaching ability test\n• Content accuracy review\n• Student feedback অনুযায়ী নিয়মিত evaluation", category: "community", displayOrder: 31, isActive: true },
  { question: "আমিও কি Instructor হতে পারবো?", answer: "হ্যাঁ! আমরা নতুন Bengali AI educators কে সুযোগ দিতে চাই। যদি তোমার AI তে দক্ষতা থাকে এবং শেখাতে আগ্রহ থাকে, তাহলে teach@aishikhibanglay.com এ apply করো এবং একটি Sample lecture video পাঠাও। Revenue sharing model এ earn করো।", category: "community", displayOrder: 32, isActive: true },
  { question: "Referral Program কি আছে?", answer: "অবশ্যই! আমাদের Refer & Earn Program এ:\n• তুমি একজনকে refer করলে তুমি পাবে ৩০০ টাকা Credit\n• তোমার referral পাবে ১৫% discount\n• Top referrers পাবে Free Premium Membership!\n\nDashboard থেকে তোমার Referral Link পাবে।", category: "community", displayOrder: 33, isActive: true },
  { question: "AI কি আমার চাকরি নিয়ে নেবে? এই বিষয়ে তোমাদের মত কী?", answer: "এটা একটা অত্যন্ত গুরুত্বপূর্ণ প্রশ্ন। আমাদের সৎ উত্তর হলো — AI কিছু কাজ পরিবর্তন করবে, কিছু কাজ কমাবে, এবং অনেক নতুন কাজ তৈরি করবে। যারা AI শিখবে, তারা পরিবর্তনের সাথে adapt করবে। যারা শিখবে না, তারা পিছিয়ে পড়তে পারে।", category: "general", displayOrder: 34, isActive: true },
  { question: "কিভাবে শুরু করবো? First Step কী?", answer: "শুরু করা একদম সহজ! ৩টি simple step:\n1. Free Account তৈরি করো — ৩০ সেকেন্ড লাগবে\n2. Free Course শুরু করো — \"AI Beginner Crash Course\" দিয়ে শুরু করো\n3. Community তে যোগ দাও — হাজারো learner তোমার পাশে আছে\n\nPerfect time বলে কিছু নেই। শুরু করো এখনই!", category: "general", displayOrder: 35, isActive: true },
];

async function seedIfEmpty() {
  const existing = await db.select().from(faqItemsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(faqItemsTable).values(DEFAULT_FAQS);
  }
}

// ── Public: list all active FAQs ──────────────────────────────────────────────
router.get("/faq", async (_req, res): Promise<void> => {
  try {
    await seedIfEmpty();
    const items = await db
      .select()
      .from(faqItemsTable)
      .where(eq(faqItemsTable.isActive, true))
      .orderBy(asc(faqItemsTable.displayOrder), asc(faqItemsTable.id));
    res.json(items);
  } catch (err) {
    console.error("[faq] GET /faq error:", err);
    res.status(500).json({ error: "Failed to fetch FAQ items" });
  }
});

// ── Admin: list all FAQs (including inactive) ─────────────────────────────────
router.get("/admin/faq", requireAdmin, async (_req, res): Promise<void> => {
  try {
    await seedIfEmpty();
    const items = await db
      .select()
      .from(faqItemsTable)
      .orderBy(asc(faqItemsTable.displayOrder), asc(faqItemsTable.id));
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch FAQ items" });
  }
});

// ── Admin: create ──────────────────────────────────────────────────────────────
router.post("/admin/faq", requireAdmin, async (req, res): Promise<void> => {
  const { question, answer, category, displayOrder, isActive } = req.body;
  if (!question?.trim() || !answer?.trim()) {
    res.status(400).json({ error: "question এবং answer আবশ্যিক" });
    return;
  }
  try {
    const [created] = await db
      .insert(faqItemsTable)
      .values({
        question: String(question).trim(),
        answer: String(answer).trim(),
        category: String(category ?? "general"),
        displayOrder: Number(displayOrder ?? 0),
        isActive: isActive !== false,
      })
      .returning();
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Failed to create FAQ item" });
  }
});

// ── Admin: update ──────────────────────────────────────────────────────────────
router.put("/admin/faq/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { question, answer, category, displayOrder, isActive } = req.body;
  if (!question?.trim() || !answer?.trim()) {
    res.status(400).json({ error: "question এবং answer আবশ্যিক" });
    return;
  }
  try {
    const [updated] = await db
      .update(faqItemsTable)
      .set({
        question: String(question).trim(),
        answer: String(answer).trim(),
        category: String(category ?? "general"),
        displayOrder: Number(displayOrder ?? 0),
        isActive: Boolean(isActive),
      })
      .where(eq(faqItemsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update FAQ item" });
  }
});

// ── Admin: delete ──────────────────────────────────────────────────────────────
router.delete("/admin/faq/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  try {
    await db.delete(faqItemsTable).where(eq(faqItemsTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to delete FAQ item" });
  }
});

export default router;
