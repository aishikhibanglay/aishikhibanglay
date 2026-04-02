import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, HelpCircle, MessageSquare, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { PageSEO } from "@/components/PageSEO";

/* ─── TYPES & CONSTANTS ─── */

type Category = "all" | "general" | "course" | "payment" | "technical" | "career" | "community";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
}

const TABS: { key: Category; label: string }[] = [
  { key: "all",       label: "🗂️ সব" },
  { key: "general",   label: "ℹ️ সাধারণ" },
  { key: "course",    label: "📚 কোর্স" },
  { key: "payment",   label: "💳 পেমেন্ট" },
  { key: "technical", label: "⚙️ Technical" },
  { key: "career",    label: "🎯 ক্যারিয়ার" },
  { key: "community", label: "🤝 Community" },
];

const SECTION_LABELS: Record<string, { emoji: string; label: string }> = {
  general:   { emoji: "ℹ️", label: "সাধারণ প্রশ্নাবলী" },
  course:    { emoji: "📚", label: "কোর্স সংক্রান্ত প্রশ্নাবলী" },
  payment:   { emoji: "💳", label: "পেমেন্ট ও মূল্য সংক্রান্ত প্রশ্নাবলী" },
  technical: { emoji: "⚙️", label: "Technical প্রশ্নাবলী" },
  career:    { emoji: "🎯", label: "ক্যারিয়ার ও উপার্জন সংক্রান্ত প্রশ্নাবলী" },
  community: { emoji: "🤝", label: "Community ও Support সংক্রান্ত প্রশ্নাবলী" },
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/* ─── ANSWER RENDERER ─── */
function AnswerText({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => (
        <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
      ))}
    </div>
  );
}

/* ─── FAQ ITEM ─── */
function FaqCard({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="border border-border/50 rounded-xl overflow-hidden bg-card/30 hover:border-primary/30 transition-colors"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-foreground leading-snug">{item.question}</span>
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <Plus className="w-3.5 h-3.5" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border/40 pt-4">
              <AnswerText text={item.answer} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── SECTION GROUP ─── */
function SectionGroup({ category, items }: { category: string; items: FaqItem[] }) {
  const meta = SECTION_LABELS[category];
  return (
    <div className="space-y-3">
      {meta && (
        <h2 className="text-base font-bold text-foreground/80 flex items-center gap-2 mt-6 mb-3">
          <span>{meta.emoji}</span>
          <span>{meta.label}</span>
          <span className="text-xs font-normal text-muted-foreground">({items.length}টি)</span>
        </h2>
      )}
      {items.map((item, i) => (
        <FaqCard key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function FAQPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${BASE}/api/faq`)
      .then((r) => r.json())
      .then((data: FaqItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = activeTab === "all" ? items : items.filter((f) => f.category === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
      );
    }
    return list;
  }, [items, activeTab, search]);

  /* Group by category for "all" tab */
  const grouped = useMemo(() => {
    if (activeTab !== "all" || search.trim()) return null;
    const order = ["general", "course", "payment", "technical", "career", "community"];
    return order
      .map((cat) => ({ cat, items: filtered.filter((f) => f.category === cat) }))
      .filter((g) => g.items.length > 0);
  }, [filtered, activeTab, search]);

  const totalCount = items.length;

  return (
    <>
      <PageSEO
        title="সচরাচর জিজ্ঞাসা (FAQ) | AI শিখি বাংলায়"
        description="AI শিখি বাংলায় প্ল্যাটফর্ম সম্পর্কে সবচেয়ে বেশি জিজ্ঞেস করা প্রশ্নের উত্তর এখানে পাবেন — কোর্স, পেমেন্ট, ক্যারিয়ার এবং আরও অনেক কিছু।"
        keywords="AI FAQ বাংলা, ChatGPT প্রশ্নোত্তর, AI শেখার প্রশ্ন, বাংলায় AI শিক্ষা"
      />

      {/* Hero */}
      <section className="relative pt-24 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            সচরাচর জিজ্ঞাসা
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            তোমার প্রশ্নের উত্তর এখানেই আছে
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground max-w-xl mx-auto text-base mb-8"
          >
            {totalCount}টি সচরাচর জিজ্ঞাসার উত্তর — বাংলায়, সহজ ভাষায়।
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="প্রশ্ন খুঁজুন..."
              className="w-full bg-card/60 border border-border/60 rounded-xl pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-transparent border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">"{search}" এর জন্য কোনো প্রশ্ন পাওয়া যায়নি।</p>
              <button
                onClick={() => { setSearch(""); setActiveTab("all"); }}
                className="mt-3 text-sm text-primary hover:underline"
              >
                সব দেখুন
              </button>
            </div>
          ) : grouped ? (
            grouped.map((g) => (
              <SectionGroup key={g.cat} category={g.cat} items={g.items} />
            ))
          ) : (
            <div className="space-y-3">
              {filtered.map((item, i) => (
                <FaqCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}

          {/* Result count when searching */}
          {search.trim() && filtered.length > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-6">
              "{search}" — {filtered.length}টি ফলাফল
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              এখনও প্রশ্ন আছে?
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              FAQ-তে উত্তর না পেলে সরাসরি আমাদের সাথে যোগাযোগ করো — আমরা সাহায্য করতে সদা প্রস্তুত।
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-4 h-4" />
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
