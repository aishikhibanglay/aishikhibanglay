import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, ArrowRight, Search, X, Loader2, PenSquare, Mail, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { api, type Post } from "@/lib/api";
import { PageSEO } from "@/components/PageSEO";
import { useSiteSettings } from "@/lib/useSiteSettings";

const CATEGORY_COLORS: Record<string, string> = {
  "টিউটোরিয়াল": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "AI টিউটোরিয়াল": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "টুলস": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "AI টুলস রিভিউ": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Prompt": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Prompt গাইড": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "আয়": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "AI দিয়ে আয়": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "নিউজ": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "AI নিউজ": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

// ─── Newsletter Widget ─────────────────────────────────────────────────────────
function NewsletterWidget({ title, subtitle }: { title: string; subtitle: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setState("success"); setEmail(""); }
      else setState("error");
    } catch { setState("error"); }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-bold text-foreground text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>
      {state === "success" ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>সফলভাবে সাবস্ক্রাইব হয়েছে!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ইমেইল ঠিকানা"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 text-xs"
            required
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
          >
            {state === "loading" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Mail className="w-3 h-3" />
            )}
            সাবস্ক্রাইব করুন
          </button>
          {state === "error" && (
            <p className="text-red-400 text-xs">সমস্যা হয়েছে, আবার চেষ্টা করুন।</p>
          )}
        </form>
      )}
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
interface SidebarProps {
  posts: Post[];
  activeFilter: string;
  onCategoryClick: (cat: string) => void;
  settings: Record<string, string>;
}

function BlogSidebar({ posts, activeFilter, onCategoryClick, settings }: SidebarProps) {
  const popularEnabled = settings.blog_sidebar_popular_enabled !== "false";
  const categoriesEnabled = settings.blog_sidebar_categories_enabled !== "false";
  const newsletterEnabled = settings.blog_sidebar_newsletter_enabled !== "false";
  const popularTitle = settings.blog_sidebar_popular_title || "🔥 জনপ্রিয় পোস্ট";
  const categoriesTitle = settings.blog_sidebar_categories_title || "📂 ক্যাটাগরি";
  const newsletterTitle = settings.blog_sidebar_newsletter_title || "📬 নিউজলেটার";
  const newsletterSubtitle = settings.blog_sidebar_newsletter_subtitle || "নতুন পোস্ট সরাসরি ইমেইলে পান";
  const popularCount = parseInt(settings.blog_sidebar_popular_count || "5", 10);

  // Popular posts = latest published posts
  const popularPosts = useMemo(() =>
    [...posts]
      .filter((p) => p.status === "published" || !p.status)
      .slice(0, popularCount),
    [posts, popularCount]
  );

  // Unique categories from posts
  const allCategories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    return cats;
  }, [posts]);

  return (
    <aside className="flex flex-col gap-5 w-full">

      {/* Popular Posts */}
      {popularEnabled && popularPosts.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-1.5">{popularTitle}</h3>
          <div className="flex flex-col gap-3">
            {popularPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-3 items-start">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                    <PenSquare className="w-5 h-5 text-muted-foreground/40" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </p>
                  <span className={`mt-1 inline-block text-[10px] px-1.5 py-0.5 rounded border ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categoriesEnabled && allCategories.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-bold text-foreground text-sm mb-3">{categoriesTitle}</h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onCategoryClick("")}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs transition-colors ${
                activeFilter === ""
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>সব পোস্ট</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryClick(cat)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs transition-colors ${
                  activeFilter === cat
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{cat}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      {newsletterEnabled && (
        <NewsletterWidget title={newsletterTitle} subtitle={newsletterSubtitle} />
      )}
    </aside>
  );
}

// ─── Main Blog Page ────────────────────────────────────────────────────────────
export default function Blog() {
  const { settings } = useSiteSettings();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") ?? "";
  });

  useEffect(() => {
    api.listPosts()
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime()
        );
        setPosts(sorted);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  // Parse dynamic categories from settings
  const dynamicFilters = useMemo(() => {
    try {
      const cats: string[] = JSON.parse(settings.blog_categories || "[]");
      return [{ label: "সব", match: "" }, ...cats.map((c) => ({ label: c, match: c }))];
    } catch {
      return [
        { label: "সব", match: "" },
        { label: "টিউটোরিয়াল", match: "টিউটোরিয়াল" },
        { label: "টুলস", match: "টুলস" },
        { label: "Prompt", match: "Prompt" },
        { label: "আয়", match: "আয়" },
        { label: "নিউজ", match: "নিউজ" },
      ];
    }
  }, [settings.blog_categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = activeFilter === "" || post.category.includes(activeFilter);
      const matchesQuery =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeFilter, posts]);

  const blogTitle = settings.blog_title || "আমাদের ব্লগ";
  const blogSubtitle = settings.blog_subtitle || "AI দুনিয়ার সর্বশেষ খবর, টিউটোরিয়াল এবং গাইডলাইন বাংলায় পড়তে আমাদের ব্লগগুলো এক্সপ্লোর করুন।";

  // Split blogTitle into normal + colored part (last word gets color)
  const titleWords = blogTitle.split(" ");
  const normalPart = titleWords.slice(0, -1).join(" ");
  const coloredPart = titleWords[titleWords.length - 1];

  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO
        title="ব্লগ"
        canonical="/blog"
        description="AI বিষয়ক সর্বশেষ খবর, টিউটোরিয়াল এবং গাইডলাইন বাংলায় পড়ুন।"
      />
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {normalPart && <>{normalPart} </>}
            <span className="text-primary">{coloredPart}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.07 }}
            className="text-lg text-muted-foreground"
          >
            {blogSubtitle}
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto">

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="relative mb-5"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              data-testid="input-blog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="পোস্ট খুঁজুন..."
              className="w-full pl-12 pr-12 py-3.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
            {query && (
              <button
                data-testid="button-clear-search"
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {dynamicFilters.map((f) => {
              const isActive = activeFilter === f.match;
              return (
                <button
                  key={f.label}
                  data-testid={`button-filter-${f.label}`}
                  onClick={() => setActiveFilter(f.match)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            {!loading && (
              <span className="ml-auto self-center text-xs text-muted-foreground">
                {filtered.length} টি পোস্ট
              </span>
            )}
          </motion.div>

          {/* 2-column layout: Posts grid + Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Posts Grid */}
            <div className="flex-1 min-w-0">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              )}
              {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                      filtered.map((post, idx) => (
                        <motion.article
                          key={post.id}
                          layout
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.3, delay: idx * 0.04 }}
                          data-testid={`card-blog-post-${post.id}`}
                          className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group flex flex-col"
                        >
                          <Link href={`/blog/${post.slug}`} className="block">
                            <div className="aspect-video w-full overflow-hidden bg-muted">
                              {post.coverImage ? (
                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <PenSquare className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                              )}
                            </div>
                          </Link>
                          <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${getCategoryColor(post.category)}`}>
                                {post.category}
                              </span>
                              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                <Clock className="w-3 h-3" />
                                <span>{post.readTime} মিনিট</span>
                              </div>
                              {(post.publishedAt ?? post.createdAt) && (
                                <div className="flex items-center gap-1 text-muted-foreground text-xs ml-auto">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
                                </div>
                              )}
                            </div>
                            <Link href={`/blog/${post.slug}`}>
                              <h2 className="text-base font-bold mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                                {post.title}
                              </h2>
                            </Link>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1 mb-3">
                              {post.excerpt}
                            </p>
                            <Link href={`/blog/${post.slug}`}>
                              <button
                                data-testid={`button-read-more-${post.id}`}
                                className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:gap-2.5 transition-all"
                              >
                                আরও পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </Link>
                          </div>
                        </motion.article>
                      ))
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        data-testid="text-no-results"
                        className="col-span-2 flex flex-col items-center justify-center py-20 text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
                          <PenSquare className="w-7 h-7 text-muted-foreground" />
                        </div>
                        {query || activeFilter ? (
                          <>
                            <h3 className="text-xl font-semibold text-foreground mb-2">কোনো ফলাফল পাওয়া যায়নি</h3>
                            <p className="text-muted-foreground text-sm max-w-xs">অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন।</p>
                            <button
                              data-testid="button-reset-filters"
                              onClick={() => { setQuery(""); setActiveFilter(""); }}
                              className="mt-5 px-4 py-2 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                            >
                              সব পোস্ট দেখুন
                            </button>
                          </>
                        ) : (
                          <>
                            <h3 className="text-xl font-semibold text-foreground mb-2">এখনো কোনো পোস্ট প্রকাশিত হয়নি</h3>
                            <p className="text-muted-foreground text-sm max-w-xs">শীঘ্রই নতুন পোস্ট আসছে।</p>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
              {!loading && (
                <BlogSidebar
                  posts={posts}
                  activeFilter={activeFilter}
                  onCategoryClick={setActiveFilter}
                  settings={settings}
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
