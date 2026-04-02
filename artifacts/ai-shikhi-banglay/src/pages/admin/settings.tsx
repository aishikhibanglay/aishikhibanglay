import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { invalidateSettingsCache } from "@/lib/useSiteSettings";
import { invalidateSocialLinksCache } from "@/lib/useSocialLinks";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  Save,
  Eye,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  Link,
  Mail,
  Video,
  CheckCircle2,
  Music2,
  Plus,
  Trash2,
  Pencil,
  X,
  GripVertical,
  Globe,
  Linkedin,
  Ghost,
  Image,
  Type,
  Upload,
} from "lucide-react";

// ─── SOCIAL LINK ICONS ────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { value: "youtube",   label: "YouTube",   Icon: Youtube },
  { value: "facebook",  label: "Facebook",  Icon: Facebook },
  { value: "twitter",   label: "X (Twitter)", Icon: Twitter },
  { value: "instagram", label: "Instagram", Icon: Instagram },
  { value: "tiktok",    label: "TikTok",    Icon: Music2 },
  { value: "linkedin",  label: "LinkedIn",  Icon: Linkedin },
  { value: "github",    label: "GitHub",    Icon: Ghost },
  { value: "link",      label: "অন্যান্য",   Icon: Globe },
];

function getSocialIcon(icon: string) {
  return ICON_OPTIONS.find((o) => o.value === icon)?.Icon ?? Globe;
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface SocialLink {
  id: number;
  label: string;
  url: string;
  icon: string;
  displayOrder: number;
}

interface Settings {
  brand_name: string;
  logo_url: string;
  youtube_channel_url: string;
  youtube_subscribe_url: string;
  featured_youtube_video_id: string;
  featured_youtube_videos: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_primary_href: string;
  hero_cta_secondary: string;
  hero_cta_secondary_href: string;
  newsletter_title: string;
  newsletter_subtitle: string;
  footer_description: string;
  footer_copyright: string;
  footer_tagline: string;
  footer_main_title: string;
  footer_legal_title: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function extractYoutubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  const pat = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const m = urlOrId.match(pat);
  return m ? m[1] : urlOrId;
}

// ─── FORM COMPONENTS ──────────────────────────────────────────────────────────
function InputField({
  label, hint, icon: Icon, value, onChange, placeholder, type = "text",
}: {
  label: string; hint: string; icon: React.ElementType;
  value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        <Icon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
      />
      <p className="text-xs text-gray-500 mt-1">{hint}</p>
    </div>
  );
}

function TextareaField({
  label, hint, value, onChange, placeholder, rows = 2,
}: {
  label: string; hint?: string; value: string;
  onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm resize-none"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

// ─── SOCIAL LINK FORM (add / edit) ────────────────────────────────────────────
function SocialLinkForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<SocialLink>;
  onSave: (data: Omit<SocialLink, "id">) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "link");
  const [order, setOrder] = useState(String(initial?.displayOrder ?? 0));

  const IconPreview = getSocialIcon(icon);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Label */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">লেবেল</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="যেমন: আমাদের YouTube"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        {/* URL */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        {/* Icon */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">আইকন</label>
          <div className="flex items-center gap-2">
            <IconPreview className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              {ICON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Order */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">ক্রম (Order)</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="0"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <X className="w-3.5 h-3.5" /> বাতিল
        </button>
        <button
          onClick={() =>
            onSave({ label, url, icon, displayOrder: Number(order) })
          }
          disabled={!label.trim() || !url.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          <Save className="w-3.5 h-3.5" /> সেভ করুন
        </button>
      </div>
    </div>
  );
}

// ─── SOCIAL LINKS MANAGER ─────────────────────────────────────────────────────
function SocialLinksManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

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
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই social link টি মুছে ফেলবেন?")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/social-links/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      invalidateSocialLinksCache();
      await fetchLinks();
    }
    setDeleting(null);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold text-base flex items-center gap-2">
          <Link className="w-5 h-5 text-cyan-400" />
          সোশ্যাল মিডিয়া লিঙ্ক
        </h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> নতুন লিঙ্ক
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">লোড হচ্ছে...</p>
      ) : (
        <div className="space-y-3">
          {/* Add Form */}
          {adding && (
            <SocialLinkForm
              onSave={handleAdd}
              onCancel={() => setAdding(false)}
            />
          )}

          {/* Existing Links */}
          {links.length === 0 && !adding && (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Globe className="w-8 h-8 mx-auto mb-2 opacity-40" />
              কোনো সোশ্যাল লিঙ্ক নেই। &ldquo;নতুন লিঙ্ক&rdquo; বাটন চাপুন।
            </div>
          )}

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
                className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 group"
              >
                <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0" />
                {(() => {
                  const Icon = getSocialIcon(link.icon);
                  return <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
                })()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{link.label}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-cyan-400 truncate block transition-colors"
                  >
                    {link.url}
                  </a>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">#{link.displayOrder}</span>
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingId(link.id)}
                    className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
                    title="এডিট করুন"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    disabled={deleting === link.id}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN FORM ────────────────────────────────────────────────────────────────
function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    brand_name: "",
    logo_url: "",
    youtube_channel_url: "",
    youtube_subscribe_url: "",
    featured_youtube_video_id: "",
    featured_youtube_videos: "",
    hero_badge: "",
    hero_title: "",
    hero_subtitle: "",
    hero_cta_primary: "",
    hero_cta_primary_href: "",
    hero_cta_secondary: "",
    hero_cta_secondary_href: "",
    newsletter_title: "",
    newsletter_subtitle: "",
    footer_description: "",
    footer_copyright: "",
    footer_tagline: "",
    footer_main_title: "",
    footer_legal_title: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLogoUploader, setShowLogoUploader] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings({
            brand_name: data.brand_name ?? "",
            logo_url: data.logo_url ?? "",
            youtube_channel_url: data.youtube_channel_url ?? "",
            youtube_subscribe_url: data.youtube_subscribe_url ?? "",
            featured_youtube_video_id: data.featured_youtube_video_id ?? "",
            featured_youtube_videos: data.featured_youtube_videos ?? "",
            hero_badge: data.hero_badge ?? "",
            hero_title: data.hero_title ?? "",
            hero_subtitle: data.hero_subtitle ?? "",
            hero_cta_primary: data.hero_cta_primary ?? "",
            hero_cta_primary_href: data.hero_cta_primary_href ?? "",
            hero_cta_secondary: data.hero_cta_secondary ?? "",
            hero_cta_secondary_href: data.hero_cta_secondary_href ?? "",
            newsletter_title: data.newsletter_title ?? "",
            newsletter_subtitle: data.newsletter_subtitle ?? "",
            footer_description: data.footer_description ?? "",
            footer_copyright: data.footer_copyright ?? "",
            footer_tagline: data.footer_tagline ?? "",
            footer_main_title: data.footer_main_title ?? "",
            footer_legal_title: data.footer_legal_title ?? "",
          });
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
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

  const previewVideoId = extractYoutubeId(settings.featured_youtube_video_id);

  return (
    <AdminLayout title="সাইট সেটিংস">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── Brand & Logo ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
            <Image className="w-5 h-5 text-cyan-400" />
            ব্র্যান্ড ও লোগো
          </h2>
          <p className="text-gray-500 text-xs mb-5">
            এখানে পরিবর্তন করলে Header, Footer এবং Browser Tab-এর favicon — সব জায়গায় একসাথে বদলে যাবে।
          </p>
          {loading ? (
            <p className="text-gray-500 text-sm">লোড হচ্ছে...</p>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo upload */}
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Image className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  সাইট লোগো
                </label>
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl border border-gray-700 bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {settings.logo_url ? (
                      <img
                        src={settings.logo_url}
                        alt="লোগো প্রিভিউ"
                        className="w-full h-full object-contain p-1"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <img src="/logo.svg" alt="ডিফল্ট লোগো" className="w-full h-full object-contain p-1" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowLogoUploader(true)}
                      className="flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs px-3 py-2 rounded-lg transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> লোগো আপলোড করুন
                    </button>
                    {settings.logo_url && (
                      <button
                        onClick={() => setSettings((s) => ({ ...s, logo_url: "" }))}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 text-xs px-3 py-2 rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> ডিফল্ট লোগো ব্যবহার করুন
                      </button>
                    )}
                    <p className="text-gray-600 text-xs">PNG, SVG, JPG সাপোর্টেড<br/>পরিষ্কার দেখানোর জন্য transparent PNG বা SVG ভালো</p>
                  </div>
                </div>
              </div>

              {/* Brand name */}
              <div className="flex-1">
                <InputField
                  label="ব্র্যান্ড নাম"
                  hint='Header ও Footer-এ দেখাবে। শেষ শব্দটি সাইটের প্রাইমারি রঙে দেখাবে — যেমন: "AI শিখি বাংলায়" লিখলে "বাংলায়" রঙিন হবে।'
                  icon={Type}
                  value={settings.brand_name}
                  onChange={(v) => setSettings((s) => ({ ...s, brand_name: v }))}
                  placeholder="AI শিখি বাংলায়"
                />
                {/* Live preview */}
                {settings.brand_name && (
                  <div className="mt-3 flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                    <span className="text-xs text-gray-500">প্রিভিউ:</span>
                    {(() => {
                      const parts = (settings.brand_name || "").trim().split(" ");
                      const last = parts.pop() ?? "";
                      const first = parts.join(" ");
                      return (
                        <span className="font-bold text-sm text-white">
                          {first && <>{first} </>}
                          <span className="text-cyan-400">{last}</span>
                        </span>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Logo Upload Modal ── */}
        {showLogoUploader && (
          <ImageUploader
            onUploaded={(url) => {
              setSettings((s) => ({ ...s, logo_url: url }));
              setShowLogoUploader(false);
            }}
            onClose={() => setShowLogoUploader(false)}
          />
        )}

        {/* ── Social Links (dynamic) ── */}
        <SocialLinksManager />

        {/* ── YouTube-specific settings ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-400" />
            YouTube সেটিংস
          </h2>
          <p className="text-gray-500 text-xs mb-5">নেভিগেশনের সাবস্ক্রাইব বাটন ও হোমপেজের চ্যানেল লিঙ্কের জন্য</p>
          {loading ? (
            <p className="text-gray-500 text-sm">লোড হচ্ছে...</p>
          ) : (
            <div className="space-y-4">
              <InputField
                label="YouTube চ্যানেল URL"
                hint="হোমপেজ ও ফুটারে YouTube আইকনের লিঙ্ক হিসেবে ব্যবহৃত হবে"
                icon={Youtube}
                value={settings.youtube_channel_url}
                onChange={(v) => setSettings((s) => ({ ...s, youtube_channel_url: v }))}
                placeholder="https://www.youtube.com/@আপনার_চ্যানেল"
              />
              <InputField
                label="YouTube সাবস্ক্রাইব URL"
                hint="নেভিগেশন বারের 'সাবস্ক্রাইব করুন' বাটন এই লিঙ্কে যাবে"
                icon={Youtube}
                value={settings.youtube_subscribe_url}
                onChange={(v) => setSettings((s) => ({ ...s, youtube_subscribe_url: v }))}
                placeholder="https://www.youtube.com/@আপনার_চ্যানেল?sub_confirmation=1"
              />
            </div>
          )}
        </div>

        {/* ── Featured YouTube Video ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
            <Video className="w-5 h-5 text-red-400" />
            হোমপেজে ফিচার্ড ভিডিও
          </h2>
          <p className="text-gray-500 text-xs mb-5">
            হোমপেজের "ভিডিও দেখে শিখতে ভালোবাসেন?" সেকশনে এই YouTube ভিডিওটি দেখাবে
          </p>
          <InputField
            label="YouTube ভিডিও URL বা Video ID"
            hint='উদাহরণ: https://www.youtube.com/watch?v=dQw4w9WgXcQ অথবা শুধু Video ID: dQw4w9WgXcQ'
            icon={Youtube}
            value={settings.featured_youtube_video_id}
            onChange={(v) => setSettings((s) => ({ ...s, featured_youtube_video_id: v }))}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {previewVideoId && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">প্রিভিউ:</p>
              <div className="aspect-video rounded-lg overflow-hidden max-w-sm">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${previewVideoId}`}
                  title="YouTube video"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-gray-800">
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              <Video className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              আরও ভিডিও (thumbnail gallery)
            </label>
            <textarea
              value={settings.featured_youtube_videos}
              onChange={(e) => setSettings((s) => ({ ...s, featured_youtube_videos: e.target.value }))}
              placeholder="একাধিক YouTube URL বা Video ID কমা দিয়ে আলাদা করুন&#10;উদাহরণ: dQw4w9WgXcQ, https://youtu.be/abc123, xyz789"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              এই ভিডিওগুলো মেইন ভিডিওর নিচে thumbnail হিসেবে দেখাবে — ক্লিক করলে সেই ভিডিও চলবে। সর্বোচ্চ ৩-৪টা দিন।
            </p>
          </div>
        </div>

        {/* ── Landing Page Content ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            হোমপেজ কন্টেন্ট
          </h2>
          <p className="text-gray-500 text-xs mb-5">হিরো সেকশনের টেক্সট ও বাটন পরিবর্তন করুন</p>
          <div className="space-y-4">
            <InputField
              label="ব্যাজ টেক্সট (Badge)"
              hint='হিরোতে ছোট ব্যাজে দেখাবে'
              icon={Link}
              value={settings.hero_badge}
              onChange={(v) => setSettings((s) => ({ ...s, hero_badge: v }))}
              placeholder="আপনার মাতৃভাষায় ভবিষ্যতের প্রযুক্তি"
            />
            <InputField
              label="মূল শিরোনাম (Hero Title)"
              hint='বড় হেডিং — শেষে "AI" রাখলে সেটা রঙিন দেখাবে'
              icon={Link}
              value={settings.hero_title}
              onChange={(v) => setSettings((s) => ({ ...s, hero_title: v }))}
              placeholder="বাংলায় শিখুন AI"
            />
            <TextareaField
              label="হিরো বিবরণ (Subtitle)"
              value={settings.hero_subtitle}
              onChange={(v) => setSettings((s) => ({ ...s, hero_subtitle: v }))}
              placeholder="কৃত্রিম বুদ্ধিমতার এই নতুন যুগে..."
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="প্রথম বাটনের টেক্সট"
                hint=""
                icon={Link}
                value={settings.hero_cta_primary}
                onChange={(v) => setSettings((s) => ({ ...s, hero_cta_primary: v }))}
                placeholder="শেখা শুরু করুন"
              />
              <InputField
                label="প্রথম বাটনের লিংক"
                hint=""
                icon={Link}
                value={settings.hero_cta_primary_href}
                onChange={(v) => setSettings((s) => ({ ...s, hero_cta_primary_href: v }))}
                placeholder="/blog"
              />
              <InputField
                label="দ্বিতীয় বাটনের টেক্সট"
                hint=""
                icon={Link}
                value={settings.hero_cta_secondary}
                onChange={(v) => setSettings((s) => ({ ...s, hero_cta_secondary: v }))}
                placeholder="AI টুলস এক্সপ্লোর করুন"
              />
              <InputField
                label="দ্বিতীয় বাটনের লিংক"
                hint=""
                icon={Link}
                value={settings.hero_cta_secondary_href}
                onChange={(v) => setSettings((s) => ({ ...s, hero_cta_secondary_href: v }))}
                placeholder="/tools"
              />
            </div>
          </div>
        </div>

        {/* ── Newsletter Content ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-400" />
            নিউজলেটার সেকশন
          </h2>
          <p className="text-gray-500 text-xs mb-5">হোমপেজের সাবস্ক্রাইব সেকশনের টেক্সট</p>
          <div className="space-y-4">
            <InputField
              label="নিউজলেটার শিরোনাম"
              hint=""
              icon={Mail}
              value={settings.newsletter_title}
              onChange={(v) => setSettings((s) => ({ ...s, newsletter_title: v }))}
              placeholder="আপডেট পেতে সাবস্ক্রাইব করুন"
            />
            <TextareaField
              label="নিউজলেটার বিবরণ"
              value={settings.newsletter_subtitle}
              onChange={(v) => setSettings((s) => ({ ...s, newsletter_subtitle: v }))}
              placeholder="নতুন ব্লগ পোস্ট ও AI আপডেট সরাসরি আপনার ইমেইলে পাঠাবো।"
            />
          </div>
        </div>

        {/* ── Footer Content ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
            <Link className="w-5 h-5 text-gray-400" />
            ফুটার কন্টেন্ট
          </h2>
          <p className="text-gray-500 text-xs mb-5">ফুটারে দেখানো বিবরণ ও কপিরাইট টেক্সট</p>
          <div className="space-y-4">
            <TextareaField
              label="ফুটার বিবরণ"
              value={settings.footer_description}
              onChange={(v) => setSettings((s) => ({ ...s, footer_description: v }))}
              placeholder="আপনার মাতৃভাষায় আর্টিফিশিয়াল ইন্টেলিজেন্স শেখার..."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="গুরুত্বপূর্ণ পেজ সেকশনের শিরোনাম"
                hint=""
                icon={Link}
                value={settings.footer_main_title}
                onChange={(v) => setSettings((s) => ({ ...s, footer_main_title: v }))}
                placeholder="গুরুত্বপূর্ণ পেজ"
              />
              <InputField
                label="আইনি তথ্য সেকশনের শিরোনাম"
                hint=""
                icon={Link}
                value={settings.footer_legal_title}
                onChange={(v) => setSettings((s) => ({ ...s, footer_legal_title: v }))}
                placeholder="আইনি তথ্য"
              />
              <InputField
                label="কপিরাইট টেক্সট"
                hint=""
                icon={Link}
                value={settings.footer_copyright}
                onChange={(v) => setSettings((s) => ({ ...s, footer_copyright: v }))}
                placeholder="AI শিখি বাংলায়। সর্বস্বত্ব সংরক্ষিত।"
              />
              <InputField
                label="ফুটার ট্যাগলাইন"
                hint=""
                icon={Link}
                value={settings.footer_tagline}
                onChange={(v) => setSettings((s) => ({ ...s, footer_tagline: v }))}
                placeholder="তৈরি করা হয়েছে ভালোবাসার সাথে, বাংলাদেশের জন্য।"
              />
            </div>
          </div>
        </div>

        {/* ── Save Button ── */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                সেভ হয়েছে!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {saving ? "সেভ হচ্ছে..." : "সেটিংস সেভ করুন"}
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <SettingsForm />
    </AdminGuard>
  );
}
