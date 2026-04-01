import { motion } from "framer-motion";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const blogPosts = [
  {
    id: 1,
    category: "AI টিউটোরিয়াল",
    categoryColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    title: "ChatGPT কীভাবে ব্যবহার করবেন? সম্পূর্ণ গাইড (২০২৫)",
    excerpt: "নতুনদের জন্য চ্যাটজিপিটি ব্যবহারের এ টু জেড গাইড। কীভাবে সঠিক প্রম্পট লিখবেন এবং সেরা ফলাফল পাবেন তার বিস্তারিত আলোচনা।",
    readTime: "৭ মিনিট পড়া",
    date: "১৫ জানুয়ারি, ২০২৫"
  },
  {
    id: 2,
    category: "AI টুলস রিভিউ",
    categoryColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    title: "Midjourney বনাম DALL-E 3: ছবি তৈরির জন্য কোনটি সেরা?",
    excerpt: "এআই দিয়ে ছবি তৈরির দুটি সবচেয়ে জনপ্রিয় টুলের তুলনামূলক আলোচনা। সুবিধা, অসুবিধা এবং প্রাইসিং নিয়ে বিস্তারিত।",
    readTime: "৫ মিনিট পড়া",
    date: "১২ জানুয়ারি, ২০২৫"
  },
  {
    id: 3,
    category: "AI নিউজ",
    categoryColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    title: "Google Gemini Advanced: নতুন কী ফিচার থাকছে?",
    excerpt: "গুগলের নতুন এআই মডেল জেমিনাই এর আপডেট এবং এটি কীভাবে চ্যাটজিপিটিকে টেক্কা দিতে পারে সে সম্পর্কে জানুন।",
    readTime: "৪ মিনিট পড়া",
    date: "১০ জানুয়ারি, ২০২৫"
  },
  {
    id: 4,
    category: "AI দিয়ে আয়",
    categoryColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    title: "ফ্রিল্যান্সিংয়ে AI এর ব্যবহার: কীভাবে আয় বাড়াবেন?",
    excerpt: "আর্টিফিশিয়াল ইন্টেলিজেন্স ব্যবহার করে কীভাবে আপনার ফ্রিল্যান্সিং কাজে গতি আনবেন এবং আয় বাড়াবেন তার কয়েকটি কার্যকরী উপায়।",
    readTime: "৬ মিনিট পড়া",
    date: "৫ জানুয়ারি, ২০২৫"
  },
  {
    id: 5,
    category: "Prompt গাইড",
    categoryColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    title: "কোডিং শেখার জন্য ৫টি সেরা ChatGPT প্রম্পট",
    excerpt: "আপনি যদি প্রোগ্রামিং শিখতে চান, তবে এই ৫টি প্রম্পট ব্যবহার করে চ্যাটজিপিটিকে আপনার পার্সোনাল মেন্টর বানিয়ে নিতে পারেন।",
    readTime: "৩ মিনিট পড়া",
    date: "২ জানুয়ারি, ২০২৫"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">আমাদের <span className="text-primary">ব্লগ</span></h1>
          <p className="text-lg text-muted-foreground">
            AI দুনিয়ার সর্বশেষ খবর, টিউটোরিয়াল এবং গাইডলাইন বাংলায় পড়তে আমাদের ব্লগগুলো এক্সপ্লোর করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {blogPosts.map((post, idx) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/40 transition-colors group"
            >
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <span className={`px-3 py-1 rounded-full border font-medium ${post.categoryColor}`}>
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
              
              <Link href={post.id === 1 ? "/blog/chatgpt-bangla-guide" : `/blog/${post.id}`}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              
              <Link href={post.id === 1 ? "/blog/chatgpt-bangla-guide" : `/blog/${post.id}`}>
                <button className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                  আরও পড়ুন <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.article>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <button className="px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors font-medium">
            আরও পোস্ট লোড করুন
          </button>
        </div>
      </div>
    </div>
  );
}