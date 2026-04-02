import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { invalidateSocialLinksCache } from "@/lib/useSocialLinks";
import {
  Link,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Globe,
  GripVertical,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  Music2,
  Linkedin,
  Ghost,
  CheckCircle2,
} from "lucide-react";

// ─── ICON OPTIONS ─────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { value: "youtube",   label: "YouTube",     Icon: Youtube },
  { value: "facebook",  label: "Facebook",    Icon: Facebook },
  { value: "twitter",   label: "X (Twitter)", Icon: Twitter },
  { value: "instagram", label: "Instagram",   Icon: Instagram },
  { value: "tiktok",    label: "TikTok",      Icon: Music2 },
  { value: "linkedin",  label: "LinkedIn",    Icon: Linkedin },
  { value: "github",    label: "GitHub",      Icon: Ghost },
  { value: "link",      label: "অন্যান্য",     Icon: Globe },
];

function getSocialIcon(icon: string) {
  return ICON_OPTIONS.find((o) => o.value === icon)?.Icon ?? Globe;
}

interface SocialLink {
  id: number;
  label: string;
  url: string;
  icon: string;
  displayOrder: number;
}

// ─── FORM (add / edit) ────────────────────────────────────────────────────────
function SocialLinkForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<SocialLink>;
  onSave: (data: Omit<SocialLink, "id">) => Promise<void>;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "link");
  const [order, setOrder] = useState(String(initial?.displayOrder ?? 0));
  const [saving, setSaving] = useState(false);

  const IconPreview = getSocialIcon(icon);

  const handleSave = async () => {
    if (!label.trim() || !url.trim()) return;
    setSaving(true);
    await onSave({ label: label.trim(), url: url.trim(), icon, displayOrder: Number(order) });
    setSaving(false);
  };

  return (
    <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-cyan-400">
        {initial?.id ? "লিঙ্ক এডিট করুন" : "নতুন সোশ্যাল লিঙ্ক"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Label */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">লেবেল (নাম)</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="যেমন: আমাদের YouTube"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        {/* URL */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">লিঙ্ক (URL)</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        {/* Icon */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">প্ল্যাটফর্ম আইকন</label>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center flex-shrink-0">
              <IconPreview className="w-4 h-4 text-cyan-400" />
            </div>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              {ICON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Order */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            প্রদর্শনের ক্রম
            <span className="ml-1 text-gray-600 font-normal">(ছোট সংখ্যা = আগে)</span>
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="0"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
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
          disabled={!label.trim() || !url.trim() || saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {saving ? (
            <span className="animate-pulse">সেভ হচ্ছে...</span>
          ) : (
            <><Save className="w-3.5 h-3.5" /> সেভ করুন</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/social-links");
      if (res.ok) setLinks(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleAdd = async (data: Omit<SocialLink, "id">) => {
    const res = await fetch("/api/admin/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setAdding(false);
      invalidateSocialLinksCache();
      await fetchLinks();
      showToast("সোশ্যাল লিঙ্ক যোগ হয়েছে!");
    }
  };

  const handleEdit = async (id: number, data: Omit<SocialLink, "id">) => {
    const res = await fetch(`/api/admin/social-links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditingId(null);
      invalidateSocialLinksCache();
      await fetchLinks();
      showToast("লিঙ্ক আপডেট হয়েছে!");
    }
  };

  const handleDelete = async (id: number, label: string) => {
    if (!confirm(`"${label}" লিঙ্কটি মুছে ফেলবেন?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/social-links/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      invalidateSocialLinksCache();
      await fetchLinks();
      showToast("লিঙ্ক মুছে ফেলা হয়েছে");
    }
    setDeleting(null);
  };

  return (
    <AdminLayout title="সোশ্যাল মিডিয়া লিঙ্ক">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Toast */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-gray-800 border border-green-500/40 text-green-400 px-4 py-2.5 rounded-xl shadow-xl text-sm animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Link className="w-5 h-5 text-cyan-400" />
              সোশ্যাল মিডিয়া লিঙ্ক
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              সাইটের ফুটারে এই লিঙ্কগুলো দেখাবে
            </p>
          </div>
          {!adding && editingId === null && (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> নতুন লিঙ্ক যোগ করুন
            </button>
          )}
        </div>

        {/* Add form */}
        {adding && (
          <div className="mb-4">
            <SocialLinkForm
              onSave={handleAdd}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-16 text-gray-500 text-sm">লোড হচ্ছে...</div>
        ) : links.length === 0 && !adding ? (
          <div className="text-center py-16 border border-dashed border-gray-700 rounded-2xl">
            <Globe className="w-10 h-10 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-400 font-medium mb-1">কোনো সোশ্যাল লিঙ্ক নেই</p>
            <p className="text-gray-600 text-sm mb-5">উপরের &ldquo;নতুন লিঙ্ক যোগ করুন&rdquo; বাটন চাপুন</p>
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> প্রথম লিঙ্ক যোগ করুন
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) =>
              editingId === link.id ? (
                <SocialLinkForm
                  key={link.id}
                  initial={link}
                  onSave={(data) => handleEdit(link.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div
                  key={link.id}
                  className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 group hover:border-gray-700 transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-gray-700 flex-shrink-0" />

                  {/* Icon badge */}
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const Icon = getSocialIcon(link.icon);
                      return <Icon className="w-5 h-5 text-cyan-400" />;
                    })()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-semibold">{link.label}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-cyan-400 truncate block transition-colors"
                    >
                      {link.url}
                    </a>
                  </div>

                  {/* Order badge */}
                  <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-md flex-shrink-0">
                    ক্রম: {link.displayOrder}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => { setAdding(false); setEditingId(link.id); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 text-xs transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> এডিট
                    </button>
                    <button
                      onClick={() => handleDelete(link.id, link.label)}
                      disabled={deleting === link.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deleting === link.id ? "মুছছে..." : "মুছুন"}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Help note */}
        {links.length > 0 && (
          <p className="text-center text-xs text-gray-600 mt-6">
            "ক্রম" সংখ্যা কম হলে সেই লিঙ্কটি আগে দেখাবে • লিঙ্কগুলো সাইটের ফুটারে প্রদর্শিত হবে
          </p>
        )}
      </div>
    </AdminLayout>
  );
}

export default function AdminSocialLinksPage() {
  return (
    <AdminGuard>
      <SocialLinksPage />
    </AdminGuard>
  );
}
