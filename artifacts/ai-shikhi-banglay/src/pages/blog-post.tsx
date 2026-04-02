import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Calendar, Loader2, Tag } from "lucide-react";
import { api, type Post } from "@/lib/api";
import { PageSEO } from "@/components/PageSEO";
import { ShareButtons } from "@/components/ShareButtons";

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

function RelatedPosts({ currentPost }: { currentPost: Post }) {
  const [related, setRelated] = useState<Post[]>([]);

  useEffect(() => {
    api.listPosts()
      .then((all) => {
        const sorted = [...all].sort(
          (a, b) =>
            new Date(b.publishedAt ?? b.createdAt).getTime() -
            new Date(a.publishedAt ?? a.createdAt).getTime()
        );
        const sameCategory = sorted.filter(
          (p) =>
            p.id !== currentPost.id &&
            p.status === "published" &&
            p.category === currentPost.category
        );
        const picks = sameCategory.length >= 3
          ? sameCategory.slice(0, 3)
          : [
              ...sameCategory,
              ...sorted
                .filter(
                  (p) =>
                    p.id !== currentPost.id &&
                    p.status === "published" &&
                    p.category !== currentPost.category
                )
                .slice(0, 3 - sameCategory.length),
            ];
        setRelated(picks);
      })
      .catch(() => {});
  }, [currentPost.id, currentPost.category]);

  if (related.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-16 pt-12 border-t border-border"
    >
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-foreground">আরো পড়ুন</h2>
        <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getCategoryColor(currentPost.category)}`}>
          {currentPost.category}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200 group flex flex-col"
          >
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-36 object-cover"
              />
            ) : (
              <div className="w-full h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Tag className="w-8 h-8 text-primary/30" />
              </div>
            )}

            <div className="p-5 flex flex-col flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <span className={`px-2.5 py-0.5 rounded-full border font-medium ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime} মিনিট</span>
                </div>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-base font-bold mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2 flex-1">
                {post.excerpt}
              </p>

              <Link href={`/blog/${post.slug}`}>
                <button className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:gap-2.5 transition-all">
                  পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setPost(null);
    setNotFound(false);
    api.getPostBySlug(slug)
      .then((data) => setPost(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">পোস্ট পাওয়া যায়নি</h1>
        <p className="text-muted-foreground mb-6">এই পোস্টটি হয়তো সরিয়ে নেওয়া হয়েছে।</p>
        <Link href="/blog">
          <button className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            ব্লগে ফিরে যান
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20">
      <PageSEO
        title={post.title}
        canonical={`/blog/${post.slug}`}
        description={post.excerpt || `${post.title} — AI শিখি বাংলায়`}
        ogType="article"
      />
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link href="/blog">
            <button className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              ব্লগে ফিরে যান
            </button>
          </Link>
        </motion.div>

        {/* Cover Image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 rounded-2xl overflow-hidden"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full object-contain"
            />
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              <Tag className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} মিনিট পড়া</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-border mb-8" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="prose prose-invert prose-cyan max-w-none
            prose-headings:text-foreground prose-headings:font-bold
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground
            prose-blockquote:border-primary prose-blockquote:text-muted-foreground
            prose-code:text-cyan-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
            prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
            prose-img:rounded-xl prose-img:shadow-lg
            prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Buttons */}
        <ShareButtons title={post.title} />

        {/* Footer nav */}
        <div className="mt-8 flex justify-between items-center">
          <Link href="/blog">
            <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium">
              <ArrowLeft className="w-4 h-4" />
              সব পোস্ট দেখুন
            </button>
          </Link>
        </div>

        {/* Related Posts */}
        <RelatedPosts currentPost={post} />
      </div>
    </div>
  );
}
