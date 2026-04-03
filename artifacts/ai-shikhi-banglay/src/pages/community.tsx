import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Users, Search, X, Loader2, ChevronUp, MessageSquare, Share2,
  Plus, Shield, LogIn, LogOut, Megaphone, AlertTriangle, Mail,
  ChevronDown, Eye, EyeOff, CheckCircle2, BookOpen, HelpCircle,
} from "lucide-react";
import { useCommunityAuth, communityHeaders } from "@/lib/useCommunityAuth";
import { PageSEO } from "@/components/PageSEO";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Post {
  id: number;
  title: string;
  body: string;
  authorName: string;
  isAdminPost: boolean;
  voteCount: number;
  commentCount: number;
  status: string;
  createdAt: string;
  hasVoted?: boolean;
}

interface CommunityInfo {
  rules: string[];
  moderators: { id: number; username: string; joinedAt: string }[];
  memberCount: number;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  const days = Math.floor(hrs / 24);
  return `${days} দিন আগে`;
}

const VIDEO_EXTENSIONS = /\.(mp4|mov|avi|mkv|webm|flv|wmv|m4v)$/i;
const VIDEO_DOMAINS = /(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/i;

function hasVideoContent(text: string): boolean {
  return VIDEO_EXTENSIONS.test(text) || VIDEO_DOMAINS.test(text);
}

// ─── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, defaultTab = "login" }: { onClose: () => void; defaultTab?: "login" | "register" }) {
  const { login, register } = useCommunityAuth();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 text-sm";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Community তে যোগ দিন</h2>
        </div>

        <div className="flex gap-1 bg-muted/40 rounded-lg p-1 mb-5">
          {(["login", "register"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "login" ? "লগইন" : "নিবন্ধন"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "register" && (
            <input className={inp} placeholder="ইউজারনেম (বাংলা/English)" value={username} onChange={(e) => setUsername(e.target.value)} required />
          )}
          <input className={inp} type="email" placeholder="ইমেইল ঠিকানা" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="relative">
            <input className={inp} type={showPass ? "text" : "password"} placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {tab === "login" ? "লগইন করুন" : "নিবন্ধন করুন"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── New Post Modal ────────────────────────────────────────────────────────────
function NewPostModal({ onClose, onCreated }: { onClose: () => void; onCreated: (post: Post) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoWarning, setVideoWarning] = useState(false);

  const handleBodyChange = (val: string) => {
    setBody(val);
    setVideoWarning(hasVideoContent(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasVideoContent(body) || hasVideoContent(title)) {
      setVideoWarning(true); return;
    }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: communityHeaders(),
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onCreated(data);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 text-sm";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        <h2 className="text-lg font-bold mb-4">নতুন প্রশ্ন / পোস্ট</h2>

        {videoWarning && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium text-sm">ভিডিও অনুমোদিত নয়!</p>
              <p className="text-red-300 text-xs mt-0.5">Community তে ভিডিও লিংক বা ফাইল পোস্ট করা যাবে না। ভিডিও লিংক সরিয়ে ফেলুন।</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className={inp} placeholder="প্রশ্ন বা পোস্টের শিরোনাম" value={title}
            onChange={(e) => { setTitle(e.target.value); setVideoWarning(hasVideoContent(e.target.value) || hasVideoContent(body)); }} required />
          <textarea className={`${inp} resize-none`} rows={5} placeholder="বিস্তারিত লিখুন..." value={body}
            onChange={(e) => handleBodyChange(e.target.value)} required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading || videoWarning}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            পোস্ট করুন
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, onVote }: { post: Post; onVote: (id: number, voted: boolean) => void }) {
  const { member } = useCommunityAuth();
  const [voting, setVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVote = async () => {
    if (!member || voting) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/vote`, { method: "POST", headers: communityHeaders() });
      if (res.ok) { const d = await res.json(); onVote(post.id, d.voted); }
    } finally { setVoting(false); }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/community/post/${post.id}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border rounded-xl p-4 hover:border-primary/30 transition-all ${post.isAdminPost ? "border-primary/50 bg-primary/5" : "border-border"}`}
    >
      {post.isAdminPost && (
        <div className="flex items-center gap-1.5 text-primary text-xs font-medium mb-2">
          <Megaphone className="w-3.5 h-3.5" /> Admin ঘোষণা
        </div>
      )}
      <Link href={`/community/post/${post.id}`}>
        <h3 className="text-base font-semibold text-foreground hover:text-primary transition-colors cursor-pointer leading-snug mb-2">{post.title}</h3>
      </Link>
      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{post.body}</p>

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/70">{post.authorName}</span>
        <span>•</span>
        <span>{timeAgo(post.createdAt)}</span>
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
        <button onClick={handleVote} disabled={!member || voting}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all ${post.hasVoted ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"} disabled:opacity-50`}>
          {voting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronUp className="w-3.5 h-3.5" />}
          <span>{post.voteCount}</span>
        </button>

        <Link href={`/community/post/${post.id}`}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{post.commentCount}</span>
        </Link>

        <button onClick={handleShare}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all ml-auto">
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "কপি হয়েছে!" : "শেয়ার"}</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function CommunitySidebar({ info, faq }: { info: CommunityInfo; faq: FaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <aside className="flex flex-col gap-4 w-full">
      {/* Rules */}
      {info.rules.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-primary" /> Community নিয়ম
          </h3>
          <ol className="space-y-2">
            {info.rules.map((rule, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-primary font-bold flex-shrink-0">{i + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Moderators */}
      {info.moderators.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-400" /> Moderators
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">A</div>
              <span className="text-xs font-medium text-foreground">Admin</span>
            </div>
            {info.moderators.map((mod) => (
              <div key={mod.id} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
                  {mod.username[0]?.toUpperCase()}
                </div>
                <span className="text-xs text-foreground">{mod.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" /> Community
        </h3>
        <div className="text-xs text-muted-foreground">
          <span className="text-foreground font-bold text-base">{info.memberCount}</span> জন সদস্য
        </div>
      </div>

      {/* FAQ */}
      {faq.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold text-foreground text-sm mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-primary" /> সাধারণ প্রশ্ন
          </h3>
          <div className="flex flex-col gap-1">
            {faq.map((item) => (
              <div key={item.id} className="border-b border-border/50 last:border-0">
                <button onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                  className="w-full text-left flex items-start justify-between gap-2 py-2 text-xs text-foreground hover:text-primary transition-colors">
                  <span className="leading-snug">{item.question}</span>
                  <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform mt-0.5 ${openFaq === item.id ? "rotate-180" : ""}`} />
                </button>
                {openFaq === item.id && (
                  <p className="text-xs text-muted-foreground pb-2 leading-relaxed">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Admin */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-primary" /> Admin এ যোগাযোগ
        </h3>
        <p className="text-xs text-muted-foreground mb-3">কোনো সমস্যা বা অভিযোগ থাকলে আমাদের সাথে যোগাযোগ করুন।</p>
        <Link href="/contact">
          <button className="w-full flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
            <Mail className="w-3.5 h-3.5" /> যোগাযোগ করুন
          </button>
        </Link>
      </div>
    </aside>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { member, loading: authLoading, logout } = useCommunityAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [info, setInfo] = useState<CommunityInfo>({ rules: [], moderators: [], memberCount: 0 });
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [showNewPost, setShowNewPost] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchPosts = async (q?: string) => {
    setLoadingPosts(true);
    try {
      const url = q ? `/api/community/posts?q=${encodeURIComponent(q)}` : "/api/community/posts";
      const res = await fetch(url, { headers: { "x-community-token": localStorage.getItem("community_token") || "" } });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch { setPosts([]); }
    finally { setLoadingPosts(false); }
  };

  useEffect(() => {
    fetchPosts();
    fetch("/api/community/info").then((r) => r.json()).then(setInfo).catch(() => {});
    fetch("/api/community/faq").then((r) => r.json()).then(setFaq).catch(() => {});
  }, []);

  const handleSearch = (val: string) => {
    setSearchInput(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setQuery(val); fetchPosts(val || undefined); }, 500);
  };

  const handleVote = (id: number, voted: boolean) => {
    setPosts((prev) => prev.map((p) =>
      p.id === id ? { ...p, voteCount: p.voteCount + (voted ? 1 : -1), hasVoted: voted } : p
    ));
  };

  const handleNewPost = (post: Post) => setPosts((prev) => [post, ...prev]);

  const openJoin = () => { setAuthTab("register"); setShowAuth(true); };
  const openLogin = () => { setAuthTab("login"); setShowAuth(true); };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <PageSEO title="Community" canonical="/community" description="AI শিখি বাংলায় Community তে যোগ দিন। প্রশ্ন করুন, উত্তর দিন, অভিজ্ঞতা শেয়ার করুন।" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold">Community</h1>
            </div>
            <p className="text-muted-foreground text-sm">প্রশ্ন করুন, অভিজ্ঞতা শেয়ার করুন, একসাথে শিখুন।</p>
          </div>

          <div className="flex items-center gap-2">
            {!authLoading && !member ? (
              <>
                <button onClick={openLogin} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                  <LogIn className="w-4 h-4" /> লগইন
                </button>
                <button onClick={openJoin} className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" /> যোগ দিন
                </button>
              </>
            ) : member ? (
              <>
                <button onClick={() => setShowNewPost(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" /> পোস্ট করুন
                </button>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {member.username[0]?.toUpperCase()}
                  </div>
                  <span className="text-foreground hidden sm:inline">{member.username}</span>
                  {member.isModerator && <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Mod</span>}
                </div>
                <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors" title="লগআউট">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Warning count */}
        {member && member.warningCount > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-5 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-sm">
              আপনার <strong>{member.warningCount}টি</strong> সতর্কতা আছে। ৩টি সতর্কতা পেলে স্বয়ংক্রিয়ভাবে ban হবেন।
            </p>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="search" placeholder="Community তে খুঁজুন..." value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 text-sm"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(""); setQuery(""); fetchPosts(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Posts */}
          <div className="flex-1 min-w-0">
            {!member && !authLoading && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Community তে পোস্ট ও কমেন্ট করতে যোগ দিন বা লগইন করুন।</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={openLogin} className="text-sm text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10">লগইন</button>
                  <button onClick={openJoin} className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90">যোগ দিন</button>
                </div>
              </div>
            )}

            {loadingPosts ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">{query ? "কোনো ফলাফল নেই" : "এখনো কোনো পোস্ট নেই"}</h3>
                <p className="text-muted-foreground text-sm">{query ? "অন্য শব্দ দিয়ে খুঁজুন" : "প্রথম পোস্ট করুন!"}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {posts.map((post) => <PostCard key={post.id} post={post} onVote={handleVote} />)}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <CommunitySidebar info={info} faq={faq} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} defaultTab={authTab} />}
        {showNewPost && member && <NewPostModal onClose={() => setShowNewPost(false)} onCreated={handleNewPost} />}
      </AnimatePresence>
    </div>
  );
}
