import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useLocation } from "wouter";
import { invalidateSettingsCache } from "@/lib/useSiteSettings";
import {
  BookOpen,
  ArrowLeft,
  LogOut,
  Eye,
  Save,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  Link,
  Mail,
  Video,
  CheckCircle2,
  Music2,
} from "lucide-react";

interface Settings {
  youtube_channel_url: string;
  youtube_subscribe_url: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  tiktok_url: string;
  featured_youtube_video_id: string;
}

function extractYoutubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pat of patterns) {
    const m = urlOrId.match(pat);
    if (m) return m[1];
  }
  return urlOrId;
}

function InputField({
  label,
  hint,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  hint: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
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

function SettingsForm() {
  const { username, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState<Settings>({
    youtube_channel_url: "",
    youtube_subscribe_url: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    tiktok_url: "",
    featured_youtube_video_id: "",
  });
  const [subscribers, setSubscribers] = useState<{ id: number; email: string; subscribedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settingsRes, subsRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/admin/subscribers", { credentials: "include" }),
        ]);
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings({
            youtube_channel_url: data.youtube_channel_url ?? "",
            youtube_subscribe_url: data.youtube_subscribe_url ?? "",
            facebook_url: data.facebook_url ?? "",
            twitter_url: data.twitter_url ?? "",
            instagram_url: data.instagram_url ?? "",
            tiktok_url: data.tiktok_url ?? "",
            featured_youtube_video_id: data.featured_youtube_video_id ?? "",
          });
        }
        if (subsRes.ok) {
          setSubscribers(await subsRes.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
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

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  const previewVideoId = extractYoutubeId(settings.featured_youtube_video_id);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <div>
              <h1 className="text-white font-bold text-sm">AI শিখি বাংলায়</h1>
              <p className="text-gray-500 text-xs">সাইট সেটিংস</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/admin")}
              className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              ড্যাশবোর্ড
            </button>
            <span className="text-gray-600 text-sm">|</span>
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              সাইট দেখুন
            </a>
            <span className="text-gray-600 text-sm">|</span>
            <span className="text-gray-400 text-sm">{username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              লগআউট
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Social Links */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
            <Link className="w-5 h-5 text-cyan-400" />
            সোশ্যাল মিডিয়া লিঙ্ক
          </h2>

          {loading ? (
            <p className="text-gray-500 text-sm">লোড হচ্ছে...</p>
          ) : (
            <div className="space-y-4">
              <InputField
                label="YouTube চ্যানেল URL"
                hint="উদাহরণ: https://www.youtube.com/@YourChannelName — হোমপেজ ও ফুটারে দেখাবে"
                icon={Youtube}
                value={settings.youtube_channel_url}
                onChange={(v) => setSettings((s) => ({ ...s, youtube_channel_url: v }))}
                placeholder="https://www.youtube.com/@আপনার_চ্যানেল"
              />
              <InputField
                label="YouTube সাবস্ক্রাইব URL"
                hint="উদাহরণ: https://www.youtube.com/@YourChannelName?sub_confirmation=1 — নেভিগেশন বারের 'সাবস্ক্রাইব করুন' বাটন এখানে যাবে"
                icon={Youtube}
                value={settings.youtube_subscribe_url}
                onChange={(v) => setSettings((s) => ({ ...s, youtube_subscribe_url: v }))}
                placeholder="https://www.youtube.com/@আপনার_চ্যানেল?sub_confirmation=1"
              />
              <InputField
                label="Facebook পেজ URL"
                hint="উদাহরণ: https://www.facebook.com/YourPage"
                icon={Facebook}
                value={settings.facebook_url}
                onChange={(v) => setSettings((s) => ({ ...s, facebook_url: v }))}
                placeholder="https://www.facebook.com/আপনার_পেজ"
              />
              <InputField
                label="X (Twitter) URL"
                hint="উদাহরণ: https://x.com/YourHandle"
                icon={Twitter}
                value={settings.twitter_url}
                onChange={(v) => setSettings((s) => ({ ...s, twitter_url: v }))}
                placeholder="https://x.com/আপনার_হ্যান্ডেল"
              />
              <InputField
                label="Instagram URL"
                hint="উদাহরণ: https://www.instagram.com/YourProfile"
                icon={Instagram}
                value={settings.instagram_url}
                onChange={(v) => setSettings((s) => ({ ...s, instagram_url: v }))}
                placeholder="https://www.instagram.com/আপনার_প্রোফাইল"
              />
              <InputField
                label="TikTok URL"
                hint="উদাহরণ: https://www.tiktok.com/@YourHandle"
                icon={Music2}
                value={settings.tiktok_url}
                onChange={(v) => setSettings((s) => ({ ...s, tiktok_url: v }))}
                placeholder="https://www.tiktok.com/@আপনার_হ্যান্ডেল"
              />
            </div>
          )}
        </div>

        {/* Featured YouTube Video */}
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
        </div>

        {/* Save Button */}
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

        {/* Subscribers */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-400" />
              নিউজলেটার সাবস্ক্রাইবার ({subscribers.length})
            </h2>
          </div>
          {subscribers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              এখনো কেউ সাবস্ক্রাইব করেননি
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {subscribers.map((sub) => (
                <div key={sub.id} className="px-4 py-3 flex items-center justify-between">
                  <span className="text-gray-200 text-sm">{sub.email}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(sub.subscribedAt).toLocaleDateString("bn-BD")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <SettingsForm />
    </AdminGuard>
  );
}
