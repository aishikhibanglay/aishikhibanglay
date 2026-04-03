import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Users, Shield, Trash2, Ban, AlertTriangle, Plus, X, Save,
  Megaphone, CheckCircle2, Loader2, HelpCircle, Edit2, Eye,
  ChevronDown, ChevronUp, ToggleLeft, ToggleRight,
} from "lucide-react";

type Tab = "members" | "posts" | "rules" | "faq" | "announce";

interface Member {
  id: number; username: string; email: string;
  isBanned: boolean; bannedReason?: string;
  warningCount: number; isModerator: boolean; joinedAt: string;
}
interface Post { id: number; title: string; authorName: string; isAdminPost: boolean; status: string; voteCount: number; commentCount: number; createdAt: string; }
interface FaqItem { id: number; question: string; answer: string; displayOrder: number; isActive: boolean; }

const adminFetch = (url: string, options?: RequestInit) =>
  fetch(url, { credentials: "include", ...options, headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) } });

const inputCls = "w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 text-sm";
const btnPrimary = "flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60";
const btnDanger = "flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-2.5 py-1.5 rounded-lg text-xs transition-colors";
const btnWarning = "flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 px-2.5 py-1.5 rounded-lg text-xs transition-colors";
const btnSuccess = "flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg text-xs transition-colors";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-white font-semibold text-sm border-b border-gray-800 pb-2 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// ─── Members Tab ───────────────────────────────────────────────────────────────
function MembersTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [warnReason, setWarnReason] = useState<{ [id: number]: string }>({});
  const [banReason, setBanReason] = useState<{ [id: number]: string }>({});
  const [msg, setMsg] = useState<{ [id: number]: string }>({});
  const [search, setSearch] = useState("");

  const load = () => {
    adminFetch("/api/admin/community/members").then((r) => r.json()).then(setMembers).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const warn = async (id: number) => {
    const reason = warnReason[id] || "নিয়ম ভঙ্গ";
    const r = await adminFetch(`/api/admin/community/members/${id}/warn`, { method: "POST", body: JSON.stringify({ reason }) });
    const d = await r.json();
    setMsg((m) => ({ ...m, [id]: d.autoBanned ? "⚠️ Auto-banned!" : `সতর্কতা দেওয়া হয়েছে (${d.warningCount}/3)` }));
    setTimeout(() => setMsg((m) => { const n = { ...m }; delete n[id]; return n; }), 3000);
    load();
  };

  const ban = async (id: number, member: Member) => {
    if (member.isBanned) {
      await adminFetch(`/api/admin/community/members/${id}/ban`, { method: "POST", body: JSON.stringify({ unban: true }) });
    } else {
      const reason = banReason[id] || "নিয়ম ভঙ্গ";
      await adminFetch(`/api/admin/community/members/${id}/ban`, { method: "POST", body: JSON.stringify({ reason }) });
    }
    load();
  };

  const toggleMod = async (id: number, current: boolean) => {
    await adminFetch(`/api/admin/community/members/${id}/moderator`, { method: "POST", body: JSON.stringify({ isModerator: !current }) });
    load();
  };

  const filtered = members.filter((m) =>
    m.username.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-cyan-400 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <input className={inputCls} placeholder="নাম বা ইমেইল দিয়ে খুঁজুন" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="text-gray-400 text-xs">{filtered.length} জন সদস্য</div>
      {filtered.map((m) => (
        <div key={m.id} className={`bg-gray-900 border rounded-xl p-4 ${m.isBanned ? "border-red-500/30" : "border-gray-800"}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium">{m.username}</span>
                {m.isModerator && <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Mod</span>}
                {m.isBanned && <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Banned</span>}
              </div>
              <p className="text-gray-500 text-xs">{m.email}</p>
              {m.warningCount > 0 && (
                <p className="text-amber-400 text-xs mt-0.5">⚠️ {m.warningCount} সতর্কতা</p>
              )}
              {m.isBanned && m.bannedReason && (
                <p className="text-red-400 text-xs mt-0.5">কারণ: {m.bannedReason}</p>
              )}
              {msg[m.id] && <p className="text-emerald-400 text-xs mt-1">{msg[m.id]}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Warn */}
              {!m.isBanned && (
                <div className="flex gap-1">
                  <input className="bg-gray-800 border border-gray-700 rounded-l-lg px-2 py-1 text-xs text-white w-28 placeholder:text-gray-600 focus:outline-none" placeholder="কারণ" value={warnReason[m.id] || ""} onChange={(e) => setWarnReason((p) => ({ ...p, [m.id]: e.target.value }))} />
                  <button onClick={() => warn(m.id)} className={`${btnWarning} rounded-l-none`}><AlertTriangle className="w-3 h-3" /> সতর্ক</button>
                </div>
              )}

              {/* Ban/Unban */}
              <div className="flex gap-1">
                {!m.isBanned && (
                  <input className="bg-gray-800 border border-gray-700 rounded-l-lg px-2 py-1 text-xs text-white w-24 placeholder:text-gray-600 focus:outline-none" placeholder="কারণ" value={banReason[m.id] || ""} onChange={(e) => setBanReason((p) => ({ ...p, [m.id]: e.target.value }))} />
                )}
                <button onClick={() => ban(m.id, m)} className={m.isBanned ? btnSuccess : `${btnDanger} ${!m.isBanned ? "rounded-l-none" : ""}`}>
                  <Ban className="w-3 h-3" /> {m.isBanned ? "Unban" : "Ban"}
                </button>
              </div>

              {/* Moderator toggle */}
              <button onClick={() => toggleMod(m.id, m.isModerator)} className={m.isModerator ? btnWarning : btnSuccess}>
                <Shield className="w-3 h-3" /> {m.isModerator ? "Mod সরান" : "Mod করুন"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Posts Tab ─────────────────────────────────────────────────────────────────
function PostsTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { adminFetch("/api/admin/community/posts").then((r) => r.json()).then(setPosts).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const deletePost = async (id: number) => {
    if (!confirm("এই পোস্ট মুছবেন?")) return;
    await adminFetch(`/api/admin/community/posts/${id}`, { method: "DELETE" });
    load();
  };

  const activePosts = posts.filter((p) => p.status === "active");
  const deletedPosts = posts.filter((p) => p.status !== "active");

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-cyan-400 animate-spin" /></div>;

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-xs">{activePosts.length} সক্রিয় পোস্ট</p>
      {activePosts.map((p) => (
        <div key={p.id} className={`bg-gray-900 border rounded-xl p-3 flex items-start justify-between gap-3 ${p.isAdminPost ? "border-cyan-500/30" : "border-gray-800"}`}>
          <div className="min-w-0">
            {p.isAdminPost && <span className="text-xs text-cyan-400 font-medium">Admin Post • </span>}
            <span className="text-white text-sm font-medium line-clamp-1">{p.title}</span>
            <p className="text-gray-500 text-xs mt-0.5">{p.authorName} • ↑{p.voteCount} • 💬{p.commentCount}</p>
          </div>
          <button onClick={() => deletePost(p.id)} className={btnDanger + " flex-shrink-0"}>
            <Trash2 className="w-3 h-3" /> মুছুন
          </button>
        </div>
      ))}
      {activePosts.length === 0 && <p className="text-gray-500 text-sm text-center py-8">কোনো পোস্ট নেই</p>}
    </div>
  );
}

// ─── Rules Tab ─────────────────────────────────────────────────────────────────
function RulesTab() {
  const [rules, setRules] = useState<string[]>([]);
  const [newRule, setNewRule] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/community/rules").then((r) => r.json()).then((d) => setRules(d.rules || []));
  }, []);

  const save = async () => {
    setSaving(true);
    await adminFetch("/api/admin/community/rules", { method: "PUT", body: JSON.stringify({ rules }) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const addRule = () => { if (!newRule.trim()) return; setRules([...rules, newRule.trim()]); setNewRule(""); };
  const removeRule = (i: number) => setRules(rules.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {rules.map((rule, i) => (
          <div key={i} className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
            <span className="text-cyan-400 font-bold text-sm flex-shrink-0">{i + 1}.</span>
            <input value={rule} onChange={(e) => setRules(rules.map((r, idx) => idx === i ? e.target.value : r))}
              className="flex-1 bg-transparent text-white text-sm focus:outline-none" />
            <button onClick={() => removeRule(i)} className="text-gray-500 hover:text-red-400"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input className={`${inputCls} flex-1`} placeholder="নতুন নিয়ম লিখুন" value={newRule}
          onChange={(e) => setNewRule(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRule())} />
        <button onClick={addRule} className={btnPrimary}><Plus className="w-4 h-4" /></button>
      </div>

      <button onClick={save} disabled={saving} className={btnPrimary}>
        {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? "সংরক্ষিত!" : saving ? "হচ্ছে..." : "সংরক্ষণ করুন"}
      </button>
    </div>
  );
}

// ─── FAQ Tab ───────────────────────────────────────────────────────────────────
function FaqTab() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQ, setNewQ] = useState(""); const [newA, setNewA] = useState("");
  const [editing, setEditing] = useState<{ [id: number]: { q: string; a: string } }>({});
  const [adding, setAdding] = useState(false);

  const load = () => { adminFetch("/api/admin/community/faq").then((r) => r.json()).then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newQ.trim() || !newA.trim()) return;
    setAdding(true);
    await adminFetch("/api/admin/community/faq", { method: "POST", body: JSON.stringify({ question: newQ, answer: newA }) });
    setNewQ(""); setNewA(""); setAdding(false); load();
  };

  const update = async (id: number) => {
    const e = editing[id];
    if (!e) return;
    await adminFetch(`/api/admin/community/faq/${id}`, { method: "PUT", body: JSON.stringify({ question: e.q, answer: e.a }) });
    setEditing((p) => { const n = { ...p }; delete n[id]; return n; });
    load();
  };

  const del = async (id: number) => {
    if (!confirm("মুছবেন?")) return;
    await adminFetch(`/api/admin/community/faq/${id}`, { method: "DELETE" });
    load();
  };

  const toggle = async (id: number) => {
    await adminFetch(`/api/admin/community/faq/${id}/toggle`, { method: "PATCH" });
    load();
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-cyan-400 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className={`bg-gray-900 border rounded-xl p-4 ${item.isActive ? "border-gray-800" : "border-gray-700 opacity-60"}`}>
          {editing[item.id] ? (
            <div className="space-y-2">
              <input className={inputCls} value={editing[item.id].q} onChange={(e) => setEditing((p) => ({ ...p, [item.id]: { ...p[item.id], q: e.target.value } }))} />
              <textarea className={`${inputCls} resize-none`} rows={3} value={editing[item.id].a} onChange={(e) => setEditing((p) => ({ ...p, [item.id]: { ...p[item.id], a: e.target.value } }))} />
              <div className="flex gap-2">
                <button onClick={() => update(item.id)} className={btnPrimary}><Save className="w-3.5 h-3.5" /> সংরক্ষণ</button>
                <button onClick={() => setEditing((p) => { const n = { ...p }; delete n[item.id]; return n; })} className="text-gray-400 text-sm">বাতিল</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white text-sm font-medium">{item.question}</p>
                <p className="text-gray-400 text-xs mt-1">{item.answer}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing((p) => ({ ...p, [item.id]: { q: item.question, a: item.answer } }))} className={btnSuccess}><Edit2 className="w-3 h-3" /></button>
                <button onClick={() => toggle(item.id)} className={item.isActive ? btnWarning : btnSuccess}>{item.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}</button>
                <button onClick={() => del(item.id)} className={btnDanger}><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add new */}
      <div className="bg-gray-900 border border-gray-700 border-dashed rounded-xl p-4 space-y-2">
        <p className="text-gray-400 text-xs font-medium">নতুন FAQ যোগ করুন</p>
        <input className={inputCls} placeholder="প্রশ্ন" value={newQ} onChange={(e) => setNewQ(e.target.value)} />
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="উত্তর" value={newA} onChange={(e) => setNewA(e.target.value)} />
        <button onClick={add} disabled={adding || !newQ.trim() || !newA.trim()} className={btnPrimary}>
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} যোগ করুন
        </button>
      </div>
    </div>
  );
}

// ─── Announce Tab ──────────────────────────────────────────────────────────────
function AnnounceTab() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const r = await adminFetch("/api/admin/community/posts", { method: "POST", body: JSON.stringify({ title, body }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setTitle(""); setBody(""); setDone(true); setTimeout(() => setDone(false), 3000);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <p className="text-gray-400 text-sm mb-4">Community তে Admin পোস্ট হিসেবে ঘোষণা পাঠান।</p>
      {done && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4 flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" /> ঘোষণা প্রকাশিত হয়েছে!
        </div>
      )}
      <form onSubmit={submit} className="space-y-3">
        <input className={inputCls} placeholder="ঘোষণার শিরোনাম" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className={`${inputCls} resize-none`} rows={5} placeholder="ঘোষণার বিষয়বস্তু" value={body} onChange={(e) => setBody(e.target.value)} required />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
          ঘোষণা প্রকাশ করুন
        </button>
      </form>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
function CommunityManagerContent() {
  const [tab, setTab] = useState<Tab>("members");
  const [stats, setStats] = useState({ memberCount: 0, postCount: 0, bannedCount: 0 });

  useEffect(() => {
    fetch("/api/admin/community/stats", { credentials: "include" }).then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "members", label: "সদস্য", icon: <Users className="w-4 h-4" /> },
    { id: "posts", label: "পোস্ট", icon: <Eye className="w-4 h-4" /> },
    { id: "rules", label: "নিয়ম", icon: <Shield className="w-4 h-4" /> },
    { id: "faq", label: "FAQ", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "announce", label: "ঘোষণা", icon: <Megaphone className="w-4 h-4" /> },
  ];

  return (
    <AdminLayout title="Community ম্যানেজার">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "মোট সদস্য", value: stats.memberCount, color: "text-cyan-400" },
            { label: "সক্রিয় পোস্ট", value: stats.postCount, color: "text-emerald-400" },
            { label: "Banned", value: stats.bannedCount, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}>
              {t.icon} <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          {tab === "members" && <MembersTab />}
          {tab === "posts" && <PostsTab />}
          {tab === "rules" && <RulesTab />}
          {tab === "faq" && <FaqTab />}
          {tab === "announce" && <AnnounceTab />}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function CommunityManagerPage() {
  return <AdminGuard><CommunityManagerContent /></AdminGuard>;
}
