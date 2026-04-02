import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Plus, Trash2, Pencil, X, Save, Star, CheckCircle2,
  ExternalLink, Eye, EyeOff, Loader2,
} from "lucide-react";

// ─── GRADIENT PRESETS ─────────────────────────────────────────────────────────
const GRADIENT_PRESETS = [
  { label: "সবুজ (ChatGPT)", value: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400" },
  { label: "নীল (Gemini)", value: "bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400" },
  { label: "কমলা (Claude)", value: "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400" },
  { label: "বেগুনি (Midjourney)", value: "bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-purple-400" },
  { label: "সায়ান (Perplexity)", value: "bg-gradient-to-br from-cyan-500/20 to-sky-500/20 text-cyan-400" },
  { label: "গোলাপি (ElevenLabs)", value: "bg-gradient-to-br from-rose-500/20 to-pink-500/20 text-rose-400" },
  { label: "লাল", value: "bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-400" },
  { label: "ধূসর", value: "bg-gradient-to-br from-gray-500/20 to-slate-500/20 text-gray-400" },
];

const BADGE_OPTIONS = ["Free", "Paid", "Free / Paid", "Beta", "Coming Soon"];

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface AiTool {
  id: number;
  name: string;
  company: string;
  badge: string;
  rating: number;
  description: string;
  websiteUrl: string;
  gradientClass: string;
  displayOrder: number;
  isActive: boolean;
}

type ToolDraft = Omit<AiTool, "id">;

const EMPTY_DRAFT: ToolDraft = {
  name: "", company: "", badge: "Free / Paid", rating: 4.0,
  description: "", websiteUrl: "",
  gradientClass: GRADIENT_PRESETS[0].value,
  displayOrder: 0, isActive: true,
};

// ─── TOOL FORM ────────────────────────────────────────────────────────────────
function ToolForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<AiTool>;
  onSave: (data: ToolDraft) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ToolDraft>({ ...EMPTY_DRAFT, ...initial });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof ToolDraft, v: ToolDraft[keyof ToolDraft]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const handleSave = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);
    await onSave(draft);
    setSaving(false);
  };

  const previewGradient = draft.gradientClass.split(" ").slice(0, -1).join(" ");
  const previewText = draft.gradientClass.split(" ").at(-1) ?? "text-white";

  return (
    <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-5 space-y-5">
      <h3 className="text-sm font-semibold text-cyan-400">
        {initial?.id ? "টুল এডিট করুন" : "নতুন AI টুল যোগ করুন"}
      </h3>

      {/* Preview strip */}
      <div className={`h-16 ${previewGradient} rounded-lg flex items-center px-4 gap-3`}>
        <div>
          <p className={`font-bold ${previewText}`}>{draft.name || "Tool Name"}</p>
          <p className="text-white/70 text-xs">{draft.company || "Company"}</p>
        </div>
        {draft.badge && (
          <span className="ml-auto text-xs bg-black/30 text-white px-2 py-0.5 rounded-full">
            {draft.badge}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">টুলের নাম *</label>
          <input
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="যেমন: ChatGPT"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        {/* Company */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">কোম্পানি</label>
          <input
            value={draft.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="যেমন: OpenAI"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        {/* Website URL */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">ওয়েবসাইট URL</label>
          <input
            value={draft.websiteUrl}
            onChange={(e) => set("websiteUrl", e.target.value)}
            placeholder="https://..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        {/* Badge */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">মূল্য ব্যাজ</label>
          <div className="flex gap-2">
            <select
              value={draft.badge}
              onChange={(e) => set("badge", e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              {BADGE_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        {/* Rating */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            রেটিং: <span className="text-amber-400">{draft.rating.toFixed(1)}/5.0</span>
          </label>
          <input
            type="range" min={1} max={5} step={0.5}
            value={draft.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="flex mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < draft.rating ? "fill-amber-400 text-amber-400" : "text-gray-600"}`} />
            ))}
          </div>
        </div>
        {/* Display Order */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            প্রদর্শনের ক্রম <span className="text-gray-600 font-normal">(ছোট = আগে)</span>
          </label>
          <input
            type="number"
            value={draft.displayOrder}
            onChange={(e) => set("displayOrder", Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        {/* Gradient */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">কার্ডের রঙ</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GRADIENT_PRESETS.map((g) => (
              <button
                key={g.value}
                onClick={() => set("gradientClass", g.value)}
                className={`h-8 rounded-lg border-2 transition-all ${g.value.split(" ").slice(0, -1).join(" ")} ${
                  draft.gradientClass === g.value ? "border-white scale-105" : "border-transparent"
                }`}
                title={g.label}
              />
            ))}
          </div>
        </div>
        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">বিবরণ</label>
          <textarea
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="টুলটির সম্পর্কে বাংলায় লিখুন..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>
        {/* Active */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => set("isActive", !draft.isActive)}
              className={`w-10 h-5 rounded-full transition-colors relative ${draft.isActive ? "bg-cyan-500" : "bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${draft.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-xs text-gray-400">{draft.isActive ? "সক্রিয় (পাবলিকে দেখাবে)" : "নিষ্ক্রিয় (লুকানো)"}</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <X className="w-3.5 h-3.5" /> বাতিল
        </button>
        <button
          onClick={handleSave}
          disabled={!draft.name.trim() || saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saving ? "সেভ হচ্ছে..." : "সেভ করুন"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function ToolsManagerPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const fetchTools = async () => {
    try {
      const res = await fetch("/api/admin/tools", { credentials: "include" });
      if (res.ok) setTools(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTools(); }, []);

  const handleAdd = async (data: ToolDraft) => {
    const res = await fetch("/api/admin/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setAdding(false);
      await fetchTools();
      showToast("নতুন টুল যোগ হয়েছে!");
    }
  };

  const handleEdit = async (id: number, data: ToolDraft) => {
    const res = await fetch(`/api/admin/tools/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditingId(null);
      await fetchTools();
      showToast("টুল আপডেট হয়েছে!");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" টুলটি মুছে ফেলবেন?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/tools/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      await fetchTools();
      showToast("টুল মুছে ফেলা হয়েছে");
    }
    setDeleting(null);
  };

  const handleToggle = async (tool: AiTool) => {
    const res = await fetch(`/api/admin/tools/${tool.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...tool, isActive: !tool.isActive }),
    });
    if (res.ok) {
      await fetchTools();
      showToast(tool.isActive ? "টুল নিষ্ক্রিয় করা হয়েছে" : "টুল সক্রিয় করা হয়েছে");
    }
  };

  return (
    <AdminLayout title="AI টুলস ম্যানেজার">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Toast */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-gray-800 border border-green-500/40 text-green-400 px-4 py-2.5 rounded-xl shadow-xl text-sm">
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              AI টুলস ম্যানেজার
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              AI টুলস পেজে যা দেখাবে তা এখান থেকে নিয়ন্ত্রণ করুন
            </p>
          </div>
          {!adding && editingId === null && (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> নতুন টুল যোগ করুন
            </button>
          )}
        </div>

        {/* Add form */}
        {adding && (
          <div className="mb-4">
            <ToolForm onSave={handleAdd} onCancel={() => setAdding(false)} />
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : tools.length === 0 && !adding ? (
          <div className="text-center py-16 border border-dashed border-gray-700 rounded-2xl">
            <Star className="w-10 h-10 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-400 font-medium mb-1">কোনো টুল নেই</p>
            <button
              onClick={() => setAdding(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> প্রথম টুল যোগ করুন
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tools.map((tool) =>
              editingId === tool.id ? (
                <ToolForm
                  key={tool.id}
                  initial={tool}
                  onSave={(data) => handleEdit(tool.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div
                  key={tool.id}
                  className={`flex items-center gap-4 bg-gray-900 border rounded-xl px-5 py-4 transition-colors ${
                    tool.isActive ? "border-gray-800 hover:border-gray-700" : "border-gray-800/50 opacity-60"
                  }`}
                >
                  {/* Color strip */}
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 ${tool.gradientClass.split(" ").slice(0, -1).join(" ")}`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-white font-semibold">{tool.name}</p>
                      {tool.company && <span className="text-xs text-gray-500">{tool.company}</span>}
                      <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{tool.badge}</span>
                      {!tool.isActive && <span className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">নিষ্ক্রিয়</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < tool.rating ? "fill-amber-400 text-amber-400" : "text-gray-700"}`} />
                        ))}
                      </div>
                      {tool.websiteUrl && (
                        <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-gray-600 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                          <ExternalLink className="w-3 h-3" /> {tool.websiteUrl.replace("https://", "")}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Order */}
                  <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-md flex-shrink-0">#{tool.displayOrder}</span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(tool)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        tool.isActive
                          ? "text-gray-400 hover:text-amber-400 hover:bg-amber-500/10"
                          : "text-gray-600 hover:text-green-400 hover:bg-green-500/10"
                      }`}
                      title={tool.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                    >
                      {tool.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setAdding(false); setEditingId(tool.id); }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                      title="এডিট করুন"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tool.id, tool.name)}
                      disabled={deleting === tool.id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      title="মুছুন"
                    >
                      {deleting === tool.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {tools.length > 0 && (
          <p className="text-center text-xs text-gray-600 mt-6">
            মোট {tools.length}টি টুল · সক্রিয়: {tools.filter(t => t.isActive).length}টি · নিষ্ক্রিয়: {tools.filter(t => !t.isActive).length}টি
          </p>
        )}
      </div>
    </AdminLayout>
  );
}

export default function AdminToolsManagerPage() {
  return (
    <AdminGuard>
      <ToolsManagerPage />
    </AdminGuard>
  );
}
