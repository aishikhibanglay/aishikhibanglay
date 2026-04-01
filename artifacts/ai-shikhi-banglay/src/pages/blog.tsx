import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, ArrowRight, Search, X } from "lucide-react";
import { Link } from "wouter";

const blogPosts = [
  {
    id: 1,
    category: "AI টিউটোরিয়াল",
    categoryColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    title: "ChatGPT কীভাবে ব্যবহার করবেন? সম্পূর্ণ গাইড (২০২৫)",
    excerpt:
      "নতুনদের জন্য চ্যাটজিপিটি ব্যবহারের এ টু জেড গাইড। কীভাবে সঠিক প্রম্পট লিখবেন এবং সেরা ফলাফল পাবেন তার বিস্তারিত আলোচনা।",
    readTime: "৭ মিনিট পড়া",
    date: "১৫ জানুয়ারি, ২০২৫",
  },
  {
    id: 2,
    category: "AI টুলস রিভিউ",
    categoryColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    title: "Midjourney বনাম DALL-E 3: ছবি তৈরির জন্য কোনটি সেরা?",
    excerpt:
      "এআই দিয়ে ছবি তৈরির দুটি সবচেয়ে জনপ্রিয় টুলের তুলনামূলক আলোচনা। সুবিধা, অসুবিধা এবং প্রাইসিং নিয়ে বিস্তারিত।",
    readTime: "৫ মিনিট পড়া",
    date: "১২ জানুয়ারি, ২০২৫",
  },
  {
    id: 3,
    category: "AI নিউজ",
    categoryColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    title: "Google Gemini Advanced: নতুন কী ফিচার থাকছে?",
    excerpt:
      "গুগলের নতুন এআই মডেল জেমিনাই এর আপডেট এবং এটি কীভাবে চ্যাটজিপিটিকে টেক্কা দিতে পারে সে সম্পর্কে জানুন।",
    readTime: "৪ মিনিট পড়া",
    date: "১০ জানুয়ারি, ২০২৫",
  },
  {
    id: 4,
    category: "AI দিয়ে আয়",
    categoryColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    title: "ফ্রিল্যান্সিংয়ে AI এর ব্যবহার: কীভাবে আয় বাড়াবেন?",
    excerpt:
      "আর্টিফিশিয়াল ইন্টেলিজেন্স ব্যবহার করে কীভাবে আপনার ফ্রিল্যান্সিং কাজে গতি আনবেন এবং আয় বাড়াবেন তার কয়েকটি কার্যকরী উপায়।",
    readTime: "৬ মিনিট পড়া",
    date: "৫ জানুয়ারি, ২০২৫",
  },
  {
    id: 5,
    category: "Prompt গাইড",
    categoryColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    title: "কোডিং শেখার জন্য ৫টি সেরা ChatGPT প্রম্পট",
    excerpt:
      "আপনি যদি প্রোগ্রামিং শিখতে চান, তবে এই ৫টি প্রম্পট ব্যবহার করে চ্যাটজিপিটিকে আপনার পার্সোনাল মেন্টর বানিয়ে নিতে পারেন।",
    readTime: "৩ মিনিট পড়া",
    date: "২ জানুয়ারি, ২০২৫",
  },
];

const FILTERS = [
  { label: "সব", match: "" },
  { label: "টিউটোরিয়াল", match: "টিউটোরিয়াল" },
  { label: "টুলস", match: "টুলস" },
  { label: "Prompt", match: "Prompt" },
  { label: "আয়", match: "আয়" },
  { label: "নিউজ", match: "নিউজ" },
];

function postSlug(id: number) {
  return id === 1 ? "/blog/chatgpt-bangla-guide" : `/blog/${id}`;
}

export default function Blog() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesCategory =
        activeFilter === "" || post.category.includes(activeFilter);
      const matchesQuery =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeFilter]);

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            আমাদের <span className="text-primary">ব্লগ</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.07 }}
            className="text-lg text-muted-foreground"
          >
            AI দুনিয়ার সর্বশেষ খবর, টিউটোরিয়াল এবং গাইডলাইন বাংলায় পড়তে
            আমাদের ব্লগগুলো এক্সপ্লোর করুন।
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">

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
                aria-label="খোঁজ মুছুন"
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
            className="flex flex-wrap gap-2 mb-10"
          >
            {FILTERS.map((f) => {
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

            {/* Result count */}
            <span className="ml-auto self-center text-xs text-muted-foreground">
              {filtered.length} টি পোস্ট
            </span>
          </motion.div>

          {/* Post List */}
          <div className="grid grid-cols-1 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    data-testid={`card-blog-post-${post.id}`}
                    className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/40 transition-colors group"
                  >
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full border font-medium ${post.categoryColor}`}
                      >
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <Link href={postSlug(post.id)}>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <Link href={postSlug(post.id)}>
                      <button
                        data-testid={`button-read-more-${post.id}`}
                        className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                      >
                        আরও পড়ুন <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
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
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
                    <Search className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    কোনো ফলাফল পাওয়া যায়নি
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার পরিবর্তন করুন।
                  </p>
                  <button
                    data-testid="button-reset-filters"
                    onClick={() => { setQuery(""); setActiveFilter(""); }}
                    className="mt-5 px-4 py-2 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    সব পোস্ট দেখুন
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Load More — only show when unfiltered */}
          {filtered.length === blogPosts.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-16 flex justify-center"
            >
              <button
                data-testid="button-load-more"
                className="px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors font-medium"
              >
                আরও পোস্ট লোড করুন
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
