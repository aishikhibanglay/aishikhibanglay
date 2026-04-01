import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Loader2, Tag } from "lucide-react";
import { api, type Post } from "@/lib/api";
import { PageSEO } from "@/components/PageSEO";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
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
              className="w-full h-64 md:h-80 object-cover"
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

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/blog">
            <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium">
              <ArrowLeft className="w-4 h-4" />
              সব পোস্ট দেখুন
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
