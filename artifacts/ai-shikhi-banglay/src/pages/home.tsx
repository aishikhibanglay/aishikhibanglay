import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, PenTool, Lightbulb, TrendingUp,
  Newspaper, PlaySquare, Play, Sparkles, Youtube, Users,
  FileText, Wrench, ChevronRight, Gift, CheckCircle2, Zap,
  Brain, Network, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageSEO } from "@/components/PageSEO";
import { Link } from "wouter";
import { useSiteSettings } from "@/lib/useSiteSettings";

// ─── Category cards with category-wise filter links ───────────────────────────
const categories = [
  {
    icon: BookOpen,
    title: "AI টিউটোরিয়াল",
    desc: "AI-এর মূল বিষয়গুলো ধাপে ধাপে শিখুন",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    href: "/blog?category=টিউটোরিয়াল",
  },
  {
    icon: PenTool,
    title: "AI টুলস রিভিউ",
    desc: "সেরা AI টুলগুলোর বিস্তারিত রিভিউ",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    href: "/tools",
  },
  {
    icon: Lightbulb,
    title: "Prompt গাইড",
    desc: "AI-কে সঠিকভাবে নির্দেশ দিতে শিখুন",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    href: "/blog?category=Prompt",
  },
  {
    icon: TrendingUp,
    title: "AI দিয়ে আয়",
    desc: "AI ব্যবহার করে অনলাইনে আয় করার উপায়",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    href: "/blog?category=আয়",
  },
  {
    icon: Newspaper,
    title: "AI নিউজ",
    desc: "সর্বশেষ AI সংবাদ ও আপডেট",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    href: "/blog?category=নিউজ",
  },
  {
    icon: PlaySquare,
    title: "ভিডিও টিউটোরিয়াল",
    desc: "YouTube-এ বাংলায় সহজ AI ভিডিও গাইড",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    href: "#video",
  },
];

// ─── Hero AI illustration ─────────────────────────────────────────────────────
function AIIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <circle cx="200" cy="200" r="160" stroke="rgba(6,182,212,0.08)" strokeWidth="1" strokeDasharray="4 6" className="animate-spin-slow" style={{ animationDuration: "30s" }} />
        <circle cx="200" cy="200" r="130" stroke="rgba(6,182,212,0.12)" strokeWidth="1" strokeDasharray="3 8" className="animate-spin-slow" style={{ animationDuration: "20s", animationDirection: "reverse" }} />
        <rect x="150" y="150" width="100" height="100" rx="16" fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" />
        <rect x="162" y="162" width="76" height="76" rx="10" fill="rgba(6,182,212,0.06)" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />
        {[170, 188, 206, 224].map((y, i) => (
          <g key={i}>
            <line x1="130" y1={y} x2="150" y2={y} stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="128" cy={y} r="3" fill="rgba(6,182,212,0.7)" />
          </g>
        ))}
        {[170, 188, 206, 224].map((y, i) => (
          <g key={i}>
            <line x1="250" y1={y} x2="270" y2={y} stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="272" cy={y} r="3" fill="rgba(6,182,212,0.7)" />
          </g>
        ))}
        {[175, 200, 225].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="130" x2={x} y2="150" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={x} cy="128" r="3" fill="rgba(6,182,212,0.7)" />
          </g>
        ))}
        {[175, 200, 225].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="250" x2={x} y2="270" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={x} cy="272" r="3" fill="rgba(6,182,212,0.7)" />
          </g>
        ))}
        <path d="M185 185 Q193 178 200 185 Q207 178 215 185 Q220 193 215 200 Q220 207 215 215 Q207 222 200 215 Q193 222 185 215 Q180 207 185 200 Q180 193 185 185Z" fill="none" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="5" fill="rgba(6,182,212,0.8)" />
        <circle cx="80" cy="100" r="22" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.4)" strokeWidth="1.5" />
        <line x1="101" y1="110" x2="148" y2="158" stroke="rgba(168,85,247,0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="320" cy="90" r="22" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5" />
        <line x1="299" y1="100" x2="252" y2="155" stroke="rgba(251,191,36,0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="75" cy="310" r="20" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" />
        <line x1="94" y1="298" x2="148" y2="250" stroke="rgba(52,211,153,0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="325" cy="305" r="20" fill="rgba(248,113,113,0.08)" stroke="rgba(248,113,113,0.4)" strokeWidth="1.5" />
        <line x1="306" y1="294" x2="252" y2="250" stroke="rgba(248,113,113,0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="200" cy="60" r="4" fill="rgba(6,182,212,0.8)">
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" begin="0s" />
        </circle>
        <circle cx="340" cy="200" r="4" fill="rgba(6,182,212,0.8)">
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        <circle cx="200" cy="340" r="4" fill="rgba(6,182,212,0.8)">
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>
        <circle cx="60" cy="200" r="4" fill="rgba(6,182,212,0.8)">
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" begin="1.5s" />
        </circle>
      </svg>
      <div className="absolute top-4 left-2 bg-background/90 border border-purple-500/30 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-lg backdrop-blur-sm animate-float-slow">
        <Brain className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-xs font-medium text-purple-300">ChatGPT</span>
      </div>
      <div className="absolute top-4 right-2 bg-background/90 border border-amber-500/30 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-lg backdrop-blur-sm animate-float-slow" style={{ animationDelay: "1s" }}>
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-medium text-amber-300">Gemini</span>
      </div>
      <div className="absolute bottom-8 left-4 bg-background/90 border border-emerald-500/30 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-lg backdrop-blur-sm animate-float-slow" style={{ animationDelay: "2s" }}>
        <Layers className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-medium text-emerald-300">Midjourney</span>
      </div>
      <div className="absolute bottom-8 right-4 bg-background/90 border border-rose-500/30 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-lg backdrop-blur-sm animate-float-slow" style={{ animationDelay: "0.5s" }}>
        <Network className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-xs font-medium text-rose-300">Claude</span>
      </div>
    </div>
  );
}

function extractYoutubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  const m = urlOrId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? m[1] : urlOrId;
}

// Format a number nicely: ৫,০০০+ style
function formatBanglaCount(n: number): string {
  if (n >= 1000) {
    const k = Math.floor(n / 1000);
    const toBangla = (num: number) =>
      num.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
    return toBangla(k) + ",০০০+";
  }
  const toBangla = (num: number) =>
    num.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  return n > 0 ? toBangla(n) + "+" : "০";
}

// ─── Multi-video player component ─────────────────────────────────────────────
function VideoPlayer({ mainVideoId, extraVideoIds }: { mainVideoId: string; extraVideoIds: string[] }) {
  const allIds = [mainVideoId, ...extraVideoIds].filter(Boolean);
  const [activeId, setActiveId] = useState(allIds[0] ?? "");

  if (allIds.length === 0) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-secondary shadow-2xl flex flex-col items-center justify-center gap-3">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000')] bg-cover bg-center opacity-30" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/30 flex items-center justify-center pl-1">
            <Play className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-muted-foreground text-sm px-4 py-2 bg-black/50 rounded-lg border border-white/10 text-center max-w-xs">
            Admin সেটিংস থেকে YouTube ভিডিও লিঙ্ক যোগ করুন
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main player */}
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-secondary shadow-2xl">
        <iframe
          key={activeId}
          src={`https://www.youtube-nocookie.com/embed/${activeId}?rel=0&modestbranding=1`}
          title="YouTube Video"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full"
        />
      </div>

      {/* Thumbnail row — only if there are multiple videos */}
      {allIds.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allIds.map((id) => (
            <button
              key={id}
              onClick={() => setActiveId(id)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                activeId === id
                  ? "border-primary shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  : "border-border/40 hover:border-border"
              }`}
            >
              <img
                src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Play overlay */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                activeId === id ? "bg-primary/20" : "bg-black/30 hover:bg-black/20"
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center pl-0.5 ${
                  activeId === id ? "bg-primary" : "bg-white/20"
                }`}>
                  <Play className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subscribeMsg, setSubscribeMsg] = useState("");

  // ── Real stats from /api/stats ──
  const [stats, setStats] = useState<{
    visitors: number; posts: number; tools: number; subscribers: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  const channelUrl = settings.youtube_channel_url || "#";
  const subscribeUrl = settings.youtube_subscribe_url || settings.youtube_channel_url || "#";
  const mainVideoId = extractYoutubeId(settings.featured_youtube_video_id ?? "");
  const extraVideoIds = (settings.featured_youtube_videos ?? "")
    .split(",")
    .map((s: string) => extractYoutubeId(s.trim()))
    .filter((id: string) => id && id !== mainVideoId);

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

  // ── Stats bar items — real data where available ──
  const statItems = [
    {
      icon: Users,
      value: stats ? formatBanglaCount(stats.visitors) : "লোড হচ্ছে...",
      label: "সক্রিয় পাঠক",
      color: "text-cyan-400",
    },
    {
      icon: FileText,
      value: stats ? (stats.posts > 0 ? formatBanglaCount(stats.posts) : "আসছে...") : "লোড হচ্ছে...",
      label: "আর্টিকেল ও গাইড",
      color: "text-purple-400",
    },
    {
      icon: Wrench,
      value: stats ? (stats.tools > 0 ? formatBanglaCount(stats.tools) : "আসছে...") : "লোড হচ্ছে...",
      label: "AI টুলস রিভিউ",
      color: "text-amber-400",
    },
    {
      icon: Youtube,
      value: "১০০%",
      label: "বাংলায় কন্টেন্ট",
      color: "text-rose-400",
    },
  ];

  return (
    <div className="w-full">
      <PageSEO
        canonical="/"
        description="বাংলায় AI শিখুন — ChatGPT, Gemini, Midjourney সহ সব AI টুলসের সহজ গাইড। ভিডিও, আর্টিকেল ও ফ্রি রিসোর্স।"
      />

      {/* ══ Hero ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                {settings.hero_badge || "আপনার মাতৃভাষায় ভবিষ্যতের প্রযুক্তি"}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight leading-tight">
                {settings.hero_title ? (
                  <>
                    {settings.hero_title.replace(/AI$/, "")}
                    {settings.hero_title.endsWith("AI") && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">AI</span>
                    )}
                  </>
                ) : (
                  <>বাংলায় শিখুন <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-300">AI</span></>
                )}
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {settings.hero_subtitle || "কৃত্রিম বুদ্ধিমত্তার এই নতুন যুগে পিছিয়ে থাকবেন না। খুব সহজেই নিজের ভাষায় শিখুন AI-এর খুঁটিনাটি।"}
              </p>
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                <div className="flex -space-x-2">
                  {["🧑", "👩", "🧑", "👨", "👩"].map((e, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-cyan-500/20 border-2 border-background flex items-center justify-center text-sm">{e}</div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-white font-semibold">
                    {stats ? formatBanglaCount(stats.visitors) : "৫,০০০+"}
                  </span>{" "}
                  বাংলাভাষী ইতিমধ্যে AI শিখছেন
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link href={settings.hero_cta_primary_href || "/blog"}>
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8 font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-shadow" data-testid="button-start-learning">
                    {settings.hero_cta_primary || "শেখা শুরু করুন"} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href={settings.hero_cta_secondary_href || "/tools"}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base px-8 text-muted-foreground" data-testid="button-browse-tools">
                    {settings.hero_cta_secondary || "AI টুলস দেখুন"}
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-6 flex-wrap">
                {[
                  { icon: CheckCircle2, text: "সম্পূর্ণ বাংলায়", color: "text-green-400" },
                  { icon: CheckCircle2, text: "সম্পূর্ণ বিনামূল্যে", color: "text-cyan-400" },
                  { icon: CheckCircle2, text: "প্র্যাকটিক্যাল গাইড", color: "text-purple-400" },
                ].map(({ icon: Icon, text, color }, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:block">
              <AIIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ Stats Bar — real data ═════════════════════════════════════════════ */}
      <section className="border-y border-border bg-secondary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statItems.map(({ icon: Icon, value, label, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon className={`w-5 h-5 ${color} mb-1 opacity-70`} />
                <span className={`text-2xl font-bold ${color}`}>{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Categories ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold mb-3">কী শিখতে চান?</h2>
            <p className="text-muted-foreground">আপনার প্রয়োজন অনুযায়ী যেকোনো বিষয় বেছে নিন — সরাসরি সেই category-র পোস্টে যাবেন</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link href={cat.href}>
                  <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-[0_0_25px_-5px_rgba(8,145,178,0.25)] transition-all cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${cat.bg} ${cat.color}`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{cat.desc}</p>
                    <div className={`flex items-center gap-1 text-xs font-medium ${cat.color} opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all`}>
                      দেখুন <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Video Section — multi-video player ═══════════════════════════════ */}
      <section id="video" className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-5 border border-red-500/20">
                <Youtube className="w-4 h-4" />
                YouTube চ্যানেল
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                ভিডিও দেখে শিখতে ভালোবাসেন?
              </h2>
              <p className="text-lg text-muted-foreground mb-7">
                আমাদের ইউটিউব চ্যানেলে নিয়মিত আপলোড করা হচ্ছে নতুন সব AI টুলের ব্যবহার এবং টিউটোরিয়াল। সাবস্ক্রাইব করে যুক্ত থাকুন।
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "নিয়মিত নতুন ভিডিও আপডেট",
                  "সহজ ও সাবলীল বাংলা ভাষায় উপস্থাপনা",
                  "প্র্যাকটিক্যাল প্রোজেক্ট এবং উদাহরণ",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 flex-wrap">
                <a href={channelUrl} target="_blank" rel="noopener noreferrer" data-testid="button-youtube-channel">
                  <Button size="lg" className="gap-2">
                    <Youtube className="w-5 h-5" />
                    চ্যানেল দেখুন
                  </Button>
                </a>
                {subscribeUrl !== channelUrl && subscribeUrl !== "#" && (
                  <a href={subscribeUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="gap-2">
                      সাবস্ক্রাইব করুন
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Multi-video player */}
            <VideoPlayer mainVideoId={mainVideoId} extraVideoIds={extraVideoIds} />
          </div>
        </div>
      </section>

      {/* ══ Newsletter ════════════════════════════════════════════════════════ */}
      <section className="py-20 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
              <Gift className="w-4 h-4" />
              সাবস্ক্রাইব করুন এবং পান ফ্রি <strong>AI Prompt গাইড</strong>!
            </div>
            <h2 className="text-3xl font-bold mb-3">
              {settings.newsletter_title || "সর্বশেষ AI আপডেট সরাসরি আপনার ইমেইলে"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {settings.newsletter_subtitle || "নতুন ব্লগ পোস্ট, AI টুলস রিভিউ এবং এক্সক্লুসিভ টিপস পেতে সাবস্ক্রাইব করুন। স্প্যাম নয়, শুধু দরকারী তথ্য!"}
            </p>
            {subscribeStatus === "success" ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-green-400 font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {subscribeMsg}
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
                <Input
                  type="email"
                  placeholder="আপনার ইমেইল এড্রেস লিখুন..."
                  className="h-12 bg-background text-sm flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={subscribeStatus === "loading"}
                />
                <Button type="submit" className="h-12 px-7 font-semibold flex-shrink-0" disabled={subscribeStatus === "loading"} data-testid="button-subscribe-newsletter">
                  {subscribeStatus === "loading" ? "হচ্ছে..." : "সাবস্ক্রাইব করুন"}
                </Button>
              </form>
            )}
            {subscribeStatus === "error" && (
              <p className="text-red-400 text-sm mt-3">{subscribeMsg}</p>
            )}
            <div className="flex items-center justify-center gap-4 mt-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> স্প্যাম মুক্ত
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> যেকোনো সময় আনসাবস্ক্রাইব
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
