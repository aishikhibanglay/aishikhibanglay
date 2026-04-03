import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Save, Plus, X, CheckCircle2, ToggleLeft, ToggleRight } from "lucide-react";
import { invalidateSettingsCache } from "@/lib/useSiteSettings";

interface BlogSettings {
  blog_title: string;
  blog_subtitle: string;
  blog_categories: string;
  blog_sidebar_popular_enabled: string;
  blog_sidebar_popular_title: string;
  blog_sidebar_popular_count: string;
  blog_sidebar_categories_enabled: string;
  blog_sidebar_categories_title: string;
  blog_sidebar_newsletter_enabled: string;
  blog_sidebar_newsletter_title: string;
  blog_sidebar_newsletter_subtitle: string;
}

const DEFAULTS: BlogSettings = {
  blog_title: "আমাদের ব্লগ",
  blog_subtitle: "AI দুনিয়ার সর্বশেষ খবর, টিউটোরিয়াল এবং গাইডলাইন বাংলায় পড়তে আমাদের ব্লগগুলো এক্সপ্লোর করুন।",
  blog_categories: JSON.stringify(["টিউটোরিয়াল", "টুলস", "Prompt", "আয়", "নিউজ"]),
  blog_sidebar_popular_enabled: "true",
  blog_sidebar_popular_title: "🔥 জনপ্রিয় পোস্ট",
  blog_sidebar_popular_count: "5",
  blog_sidebar_categories_enabled: "true",
  blog_sidebar_categories_title: "📂 ক্যাটাগরি",
  blog_sidebar_newsletter_enabled: "true",
  blog_sidebar_newsletter_title: "📬 নিউজলেটার",
  blog_sidebar_newsletter_subtitle: "নতুন পোস্ট সরাসরি ইমেইলে পান",
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex items-center gap-1.5 text-sm">
      {on ? (
        <ToggleRight className="w-7 h-7 text-emerald-400" />
      ) : (
        <ToggleLeft className="w-7 h-7 text-gray-500" />
      )}
      <span className={on ? "text-emerald-400" : "text-gray-500"}>
        {on ? "চালু" : "বন্ধ"}
      </span>
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-1">{label}</label>
      {hint && <p className="text-gray-500 text-xs mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <h3 className="text-white font-semibold text-sm border-b border-gray-800 pb-2">{title}</h3>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 text-sm";
const textareaCls = `${inputCls} resize-none`;

function BlogSettingsContent() {
  const [s, setS] = useState<BlogSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Category tag input
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setS({
          blog_title: data.blog_title ?? DEFAULTS.blog_title,
          blog_subtitle: data.blog_subtitle ?? DEFAULTS.blog_subtitle,
          blog_categories: data.blog_categories ?? DEFAULTS.blog_categories,
          blog_sidebar_popular_enabled: data.blog_sidebar_popular_enabled ?? "true",
          blog_sidebar_popular_title: data.blog_sidebar_popular_title ?? DEFAULTS.blog_sidebar_popular_title,
          blog_sidebar_popular_count: data.blog_sidebar_popular_count ?? "5",
          blog_sidebar_categories_enabled: data.blog_sidebar_categories_enabled ?? "true",
          blog_sidebar_categories_title: data.blog_sidebar_categories_title ?? DEFAULTS.blog_sidebar_categories_title,
          blog_sidebar_newsletter_enabled: data.blog_sidebar_newsletter_enabled ?? "true",
          blog_sidebar_newsletter_title: data.blog_sidebar_newsletter_title ?? DEFAULTS.blog_sidebar_newsletter_title,
          blog_sidebar_newsletter_subtitle: data.blog_sidebar_newsletter_subtitle ?? DEFAULTS.blog_sidebar_newsletter_subtitle,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof BlogSettings, value: string) =>
    setS((prev) => ({ ...prev, [key]: value }));

  const toggleBool = (key: keyof BlogSettings) =>
    update(key, s[key] === "true" ? "false" : "true");

  // Category management
  const categories: string[] = (() => {
    try { return JSON.parse(s.blog_categories); } catch { return []; }
  })();

  const addCategory = () => {
    const trimmed = newCat.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    update("blog_categories", JSON.stringify([...categories, trimmed]));
    setNewCat("");
  };

  const removeCategory = (cat: string) =>
    update("blog_categories", JSON.stringify(categories.filter((c) => c !== cat)));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(s),
      });
      if (res.ok) {
        invalidateSettingsCache();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="ব্লগ সেটিংস">
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="ব্লগ সেটিংস">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">ব্লগ পেজের header, category filter ও sidebar কাস্টমাইজ করুন।</p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "সংরক্ষিত!" : saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
        </div>

        {/* ── Blog Header ── */}
        <SectionCard title="📝 ব্লগ পেজ হেডার">
          <Field label="ব্লগ পেজ শিরোনাম" hint="শেষ শব্দটি স্বয়ংক্রিয়ভাবে রঙিন হবে">
            <input
              className={inputCls}
              value={s.blog_title}
              onChange={(e) => update("blog_title", e.target.value)}
              placeholder="আমাদের ব্লগ"
            />
          </Field>
          <Field label="ব্লগ পেজ সাবটাইটেল">
            <textarea
              className={textareaCls}
              rows={3}
              value={s.blog_subtitle}
              onChange={(e) => update("blog_subtitle", e.target.value)}
              placeholder="AI দুনিয়ার সর্বশেষ খবর..."
            />
          </Field>
        </SectionCard>

        {/* ── Categories ── */}
        <SectionCard title="🏷️ ক্যাটাগরি ফিল্টার">
          <p className="text-gray-500 text-xs">এই ক্যাটাগরিগুলো ব্লগ পেজের filter বোতাম হিসেবে দেখাবে।</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat} className="flex items-center gap-1 bg-gray-800 border border-gray-700 text-white text-xs px-2.5 py-1 rounded-full">
                {cat}
                <button onClick={() => removeCategory(cat)} className="text-gray-500 hover:text-red-400 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-1">
            <input
              className={`${inputCls} flex-1`}
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="নতুন ক্যাটাগরি লিখুন"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
            />
            <button
              onClick={addCategory}
              className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> যোগ করুন
            </button>
          </div>
        </SectionCard>

        {/* ── Popular Posts Sidebar ── */}
        <SectionCard title="🔥 জনপ্রিয় পোস্ট সেকশন">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">সেকশন চালু/বন্ধ</span>
            <Toggle on={s.blog_sidebar_popular_enabled === "true"} onToggle={() => toggleBool("blog_sidebar_popular_enabled")} />
          </div>
          {s.blog_sidebar_popular_enabled === "true" && (
            <>
              <Field label="সেকশন শিরোনাম">
                <input className={inputCls} value={s.blog_sidebar_popular_title} onChange={(e) => update("blog_sidebar_popular_title", e.target.value)} />
              </Field>
              <Field label="কতটি পোস্ট দেখাবে" hint="সর্বোচ্চ ১০">
                <input
                  className={inputCls}
                  type="number"
                  min={1}
                  max={10}
                  value={s.blog_sidebar_popular_count}
                  onChange={(e) => update("blog_sidebar_popular_count", e.target.value)}
                />
              </Field>
            </>
          )}
        </SectionCard>

        {/* ── Categories Sidebar ── */}
        <SectionCard title="📂 ক্যাটাগরি সেকশন">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">সেকশন চালু/বন্ধ</span>
            <Toggle on={s.blog_sidebar_categories_enabled === "true"} onToggle={() => toggleBool("blog_sidebar_categories_enabled")} />
          </div>
          {s.blog_sidebar_categories_enabled === "true" && (
            <Field label="সেকশন শিরোনাম">
              <input className={inputCls} value={s.blog_sidebar_categories_title} onChange={(e) => update("blog_sidebar_categories_title", e.target.value)} />
            </Field>
          )}
        </SectionCard>

        {/* ── Newsletter Sidebar ── */}
        <SectionCard title="📬 নিউজলেটার সেকশন">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">সেকশন চালু/বন্ধ</span>
            <Toggle on={s.blog_sidebar_newsletter_enabled === "true"} onToggle={() => toggleBool("blog_sidebar_newsletter_enabled")} />
          </div>
          {s.blog_sidebar_newsletter_enabled === "true" && (
            <>
              <Field label="সেকশন শিরোনাম">
                <input className={inputCls} value={s.blog_sidebar_newsletter_title} onChange={(e) => update("blog_sidebar_newsletter_title", e.target.value)} />
              </Field>
              <Field label="সাবটাইটেল">
                <input className={inputCls} value={s.blog_sidebar_newsletter_subtitle} onChange={(e) => update("blog_sidebar_newsletter_subtitle", e.target.value)} />
              </Field>
            </>
          )}
        </SectionCard>

        {/* Bottom Save */}
        <div className="flex justify-end pb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "সংরক্ষিত!" : saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function BlogSettingsPage() {
  return (
    <AdminGuard>
      <BlogSettingsContent />
    </AdminGuard>
  );
}
