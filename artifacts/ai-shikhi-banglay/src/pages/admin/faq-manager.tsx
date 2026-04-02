import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Plus, Trash2, Pencil, X, Save, Eye, EyeOff, Loader2,
  HelpCircle, ChevronUp, ChevronDown,
} from "lucide-react";

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
}

type FaqDraft = Omit<FaqItem, "id">;

const CATEGORIES = [
  { value: "general", label: "ℹ️ সাধারণ" },
  { value: "course", label: "📚 কোর্স" },
  { value: "payment", label: "💳 পেমেন্ট" },
  { value: "technical", label: "⚙️ Technical" },
  { value: "career", label: "🎯 ক্যারিয়ার" },
  { value: "community", label: "🤝 Community" },
];

const EMPTY_DRAFT: FaqDraft = {
  question: "",
  answer: "",
  category: "general",
  displayOrder: 0,
  isActive: true,
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── FORM ────────────────────────────────────────────────────────────────────
function FaqForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<FaqItem>;
  onSave: (data: FaqDraft) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<FaqDraft>({ ...EMPTY_DRAFT, ...initial });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FaqDraft>(k: K, v: FaqDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const handleSave = async () => {
    if (!draft.question.trim() || !draft.answer.trim()) return;
    setSaving(true);
    await onSave(draft);
    setSaving(false);
  };

  return (
    <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-cyan-400">
        {initial?.id ? "প্রশ্ন সম্পাদনা করুন" : "নতুন প্রশ্ন যোগ করুন"}
      </h3>

      {/* Question */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">প্রশ্ন *</label>
        <input
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          placeholder="এখানে প্রশ্ন লিখুন..."
          value={draft.question}
          onChange={(e) => set("question", e.target.value)}
        />
      </div>

      {/* Answer */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">উত্তর *</label>
        <textarea
          rows={5}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 resize-y"
          placeholder="এখানে উত্তর লিখুন... (নতুন লাইনের জন্য Enter চাপুন)"
          value={draft.answer}
          onChange={(e) => set("answer", e.target.value)}
        />
        <p className="text-xs text-gray-600 mt-1">নতুন লাইনে তালিকা তৈরি করতে প্রতিটি আইটেম আলাদা লাইনে লিখুন।</p>
      </div>

      {/* Category + Order + Active */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">ক্যাটাগরি</label>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            value={draft.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">ক্রম (Display Order)</label>
          <input
            type="number"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            value={draft.displayOrder}
            onChange={(e) => set("displayOrder", Number(e.target.value))}
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="w-4 h-4 accent-cyan-500"
            />
            <span className="text-sm text-gray-300">সক্রিয় (Active)</span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={handleSave}
          disabled={saving || !draft.question.trim() || !draft.answer.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          সংরক্ষণ করুন
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          বাতিল
        </button>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
function FaqManagerPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/admin/faq");
      setItems(data);
    } catch {
      showToast("❌ লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (draft: FaqDraft) => {
    await apiFetch("/api/admin/faq", { method: "POST", body: JSON.stringify(draft) });
    setAdding(false);
    showToast("✅ প্রশ্ন যোগ করা হয়েছে");
    load();
  };

  const handleUpdate = async (draft: FaqDraft) => {
    if (!editing) return;
    await apiFetch(`/api/admin/faq/${editing.id}`, { method: "PUT", body: JSON.stringify(draft) });
    setEditing(null);
    showToast("✅ আপডেট সফল হয়েছে");
    load();
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await apiFetch(`/api/admin/faq/${id}`, { method: "DELETE" });
      showToast("✅ মুছে ফেলা হয়েছে");
      load();
    } catch {
      showToast("❌ মুছতে ব্যর্থ হয়েছে");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (item: FaqItem) => {
    await apiFetch(`/api/admin/faq/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...item, isActive: !item.isActive }),
    });
    load();
  };

  const handleMoveOrder = async (item: FaqItem, direction: "up" | "down") => {
    const newOrder = direction === "up" ? item.displayOrder - 1 : item.displayOrder + 1;
    await apiFetch(`/api/admin/faq/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...item, displayOrder: newOrder }),
    });
    load();
  };

  const filtered = filterCat === "all"
    ? items
    : items.filter((i) => i.category === filterCat);

  const catLabel = (cat: string) =>
    CATEGORIES.find((c) => c.value === cat)?.label ?? cat;

  return (
    <AdminLayout title="FAQ ম্যানেজার">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl">
          {toast}
        </div>
      )}

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-gray-400 text-sm mt-0.5">{items.length}টি প্রশ্ন ({items.filter((i) => i.isActive).length}টি সক্রিয়)</p>
          </div>
          <button
            onClick={() => { setAdding(true); setEditing(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> নতুন প্রশ্ন যোগ করুন
          </button>
        </div>

        {/* Add Form */}
        {adding && (
          <FaqForm
            onSave={handleCreate}
            onCancel={() => setAdding(false)}
          />
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCat("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCat === "all" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            🗂️ সব ({items.length})
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilterCat(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCat === c.value ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
            >
              {c.label} ({items.filter((i) => i.category === c.value).length})
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">কোনো প্রশ্ন নেই।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id}>
                {editing?.id === item.id ? (
                  <FaqForm
                    initial={editing}
                    onSave={handleUpdate}
                    onCancel={() => setEditing(null)}
                  />
                ) : (
                  <div
                    className={`bg-gray-900 border rounded-xl p-4 transition-colors ${
                      item.isActive ? "border-gray-800" : "border-gray-800 opacity-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Order controls */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0 mt-0.5">
                        <button
                          onClick={() => handleMoveOrder(item, "up")}
                          className="p-0.5 rounded text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
                          title="উপরে সরান"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-center text-[10px] text-gray-600 leading-none">{item.displayOrder}</span>
                        <button
                          onClick={() => handleMoveOrder(item, "down")}
                          className="p-0.5 rounded text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
                          title="নিচে সরান"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                            {catLabel(item.category)}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            item.isActive
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}>
                            {item.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white mb-1 leading-snug">{item.question}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{item.answer.split("\n")[0]}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleToggleActive(item)}
                          title={item.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-yellow-400 hover:bg-gray-800 transition-colors"
                        >
                          {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => { setEditing(item); setAdding(false); }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-gray-800 transition-colors"
                          title="সম্পাদনা"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors disabled:opacity-50"
                          title="মুছুন"
                        >
                          {deleting === item.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function AdminFaqManagerPage() {
  return (
    <AdminGuard>
      <FaqManagerPage />
    </AdminGuard>
  );
}
