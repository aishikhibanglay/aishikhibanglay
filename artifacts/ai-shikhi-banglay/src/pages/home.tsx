import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, PenTool, Lightbulb, TrendingUp, Newspaper, PlaySquare, Play, Sparkles, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useSiteSettings } from "@/lib/useSiteSettings";

const categories = [
  {
    icon: BookOpen,
    title: "AI টিউটোরিয়াল",
    desc: "AI-এর মূল বিষয়গুলো ধাপে ধাপে শিখুন",
    color: "text-blue-400"
  },
  {
    icon: PenTool,
    title: "AI টুলস রিভিউ",
    desc: "সেরা AI টুলগুলোর বিস্তারিত রিভিউ",
    color: "text-cyan-400"
  },
  {
    icon: Lightbulb,
    title: "Prompt গাইড",
    desc: "AI-কে সঠিকভাবে নির্দেশ দিতে শিখুন",
    color: "text-amber-400"
  },
  {
    icon: TrendingUp,
    title: "AI দিয়ে আয়",
    desc: "AI ব্যবহার করে অনলাইনে আয় করার উপায়",
    color: "text-emerald-400"
  },
  {
    icon: Newspaper,
    title: "AI নিউজ",
    desc: "সর্বশেষ AI সংবাদ ও আপডেট",
    color: "text-purple-400"
  },
  {
    icon: PlaySquare,
    title: "ভিডিও",
    desc: "ইউটিউব ভিডিও টিউটোরিয়াল",
    color: "text-rose-400"
  }
];

function extractYoutubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  const m = urlOrId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? m[1] : urlOrId;
}

export default function Home() {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subscribeMsg, setSubscribeMsg] = useState("");

  const channelUrl = settings.youtube_channel_url || "#";
  const subscribeUrl = settings.youtube_subscribe_url || settings.youtube_channel_url || "#";
  const videoId = extractYoutubeId(settings.featured_youtube_video_id);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribeStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribeStatus("success");
        setSubscribeMsg(data.message || "সাবস্ক্রাইব সফল হয়েছে!");
        setEmail("");
      } else {
        setSubscribeStatus("error");
        setSubscribeMsg(data.error || "সমস্যা হয়েছে, আবার চেষ্টা করুন");
      }
    } catch {
      setSubscribeStatus("error");
      setSubscribeMsg("নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন");
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                আপনার মাতৃভাষায় ভবিষ্যতের প্রযুক্তি
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                বাংলায় শিখুন <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">AI</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                কৃত্রিম বুদ্ধিমত্তার এই নতুন যুগে পিছিয়ে থাকবেন না। খুব সহজেই নিজের ভাষায় শিখুন AI-এর খুঁটিনাটি এবং কাজে লাগান দৈনন্দিন জীবনে।
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/blog">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 h-14" data-testid="button-start-learning">
                    শেখা শুরু করুন <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg px-8 h-14" data-testid="button-browse-tools">
                    AI টুলস এক্সপ্লোর করুন
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">কী শিখতে চান?</h2>
            <p className="text-muted-foreground">আপনার প্রয়োজন অনুযায়ী যেকোনো বিষয় বেছে নিন এবং শেখা শুরু করুন</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(8,145,178,0.3)] transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${category.color}`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                <p className="text-muted-foreground">{category.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                ভিডিও দেখে শিখতে ভালোবাসেন?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                আমাদের ইউটিউব চ্যানেলে নিয়মিত আপলোড করা হচ্ছে নতুন সব AI টুলের ব্যবহার এবং টিউটোরিয়াল। সাবস্ক্রাইব করে যুক্ত থাকুন আমাদের সাথে।
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>নিয়মিত নতুন ভিডিও আপডেট</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>সহজ ও সাবলীল বাংলা ভাষায় উপস্থাপনা</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>প্র্যাকটিক্যাল প্রোজেক্ট এবং উদাহরণ</span>
                </li>
              </ul>
              <div className="flex gap-3">
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-youtube-channel"
                >
                  <Button size="lg" className="gap-2">
                    <Youtube className="w-5 h-5" />
                    ইউটিউব চ্যানেল ভিজিট করুন
                  </Button>
                </a>
                {subscribeUrl !== channelUrl && (
                  <a
                    href={subscribeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" variant="outline" className="gap-2">
                      সাবস্ক্রাইব করুন
                    </Button>
                  </a>
                )}
              </div>
            </div>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-secondary shadow-2xl">
              {videoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title="Featured YouTube Video"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="w-full h-full"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center pl-1 mb-4">
                      <Play className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm px-4 py-2 bg-black/50 rounded-lg border border-white/10 text-center">
                      Admin সেটিংস থেকে YouTube ভিডিও যোগ করুন
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-border bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">আমাদের নিউজলেটার সাবস্ক্রাইব করুন</h2>
            <p className="text-muted-foreground mb-8">
              AI এর দুনিয়ার সর্বশেষ খবর, টিপস এবং ট্রিকস পেতে আপনার ইমেইল দিয়ে যুক্ত হোন। স্প্যাম মুক্ত, শুধু প্রয়োজনীয় তথ্য!
            </p>

            {subscribeStatus === "success" ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-green-400 font-medium">
                ✓ {subscribeMsg}
              </div>
            ) : (
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={handleSubscribe}
              >
                <Input
                  type="email"
                  placeholder="আপনার ইমেইল এড্রেস..."
                  className="h-12 bg-background"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={subscribeStatus === "loading"}
                />
                <Button
                  type="submit"
                  className="h-12 px-8"
                  disabled={subscribeStatus === "loading"}
                  data-testid="button-subscribe-newsletter"
                >
                  {subscribeStatus === "loading" ? "হচ্ছে..." : "সাবস্ক্রাইব"}
                </Button>
              </form>
            )}

            {subscribeStatus === "error" && (
              <p className="text-red-400 text-sm mt-3">{subscribeMsg}</p>
            )}

            <p className="text-xs text-muted-foreground mt-4">যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।</p>
          </div>
        </div>
      </section>
    </div>
  );
}
