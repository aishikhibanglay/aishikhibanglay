import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useLocation } from "wouter";
import { RichEditor } from "@/components/admin/RichEditor";
import {
  BookOpen, ArrowLeft, LogOut, Eye, Save, CheckCircle2, Globe, FileText
} from "lucide-react";

interface PageEditorParams {
  id?: string;
}

function PageEditorContent({ params }: { params?: PageEditorParams }) {
  const { username, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const isEditing = !!params?.id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    fetch(`/api/admin/pages`, { credentials: "include" })
      .then((r) => r.json())
      .then((pages: { id: number; title: string; slug: string; content: string; metaDescription: string; status: string }[]) => {
        const page = pages.find((p) => p.id === parseInt(params!.id!));
        if (page) {
          setTitle(page.title);
          setSlug(page.slug);
          setContent(page.content);
          setMetaDescription(page.metaDescription || "");
          setStatus(page.status as "draft" | "published");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isEditing, params?.id]);

  const generateSlug = (text: string) =>
    text
      .trim()
      .toLowerCase()
      .replace(/[^\u0980-\u09FF\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `page-${Date.now()}`;

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!isEditing || !slug) {
      setSlug(generateSlug(v));
    }
  };

  const handleLogout = async () => { await logout(); setLocation("/admin/login"); };

  const handleSave = async (publishStatus?: "draft" | "published") => {
    if (!title.trim()) return;
    setSaving(true);
    const body = {
      title,
      slug: slug || generateSlug(title),
      content,
      metaDescription,
      status: publishStatus ?? status,
    };
    try {
      let res;
      if (isEditing) {
        res = await fetch(`/api/admin/pages/${params!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/admin/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
      }
      if (res.ok) {
        const data = await res.json();
        if (!isEditing) {
          setLocation(`/admin/pages/${data.id}/edit`);
        }
        if (publishStatus) setStatus(publishStatus);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">লোড হচ্ছে...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <div>
              <h1 className="text-white font-bold text-sm">AI শিখি বাংলায়</h1>
              <p className="text-gray-500 text-xs">{isEditing ? "পেজ সম্পাদনা" : "নতুন পেজ"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/admin/pages")} className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> পেজ তালিকা
            </button>
            <span className="text-gray-600">|</span>
            {isEditing && status === "published" && (
              <a href={`/pages/${slug}`} target="_blank" className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                <Eye className="w-4 h-4" /> দেখুন
              </a>
            )}
            <span className="text-gray-600">|</span>
            <span className="text-gray-400 text-sm">{username}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm transition-colors">
              <LogOut className="w-4 h-4" /> লগআউট
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Title */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <label className="block text-gray-400 text-xs font-medium mb-2">পেজের শিরোনাম *</label>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-transparent text-white text-2xl font-bold placeholder-gray-600 focus:outline-none border-b border-gray-700 focus:border-cyan-500 pb-2 transition-colors"
            placeholder="পেজের শিরোনাম লিখুন..."
          />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-gray-500 text-xs">URL:</span>
            <span className="text-gray-500 text-xs">/pages/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="text-cyan-400 text-xs bg-transparent focus:outline-none border-b border-transparent focus:border-cyan-500 min-w-[100px]"
              placeholder="slug"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <p className="text-gray-400 text-xs font-medium">পেজের কন্টেন্ট</p>
          </div>
          <div className="p-2">
            <RichEditor
              content={content}
              onChange={setContent}
              placeholder="এখানে পেজের কন্টেন্ট লিখুন..."
            />
          </div>
        </div>

        {/* Meta Description */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <label className="block text-gray-400 text-xs font-medium mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> SEO বিবরণ (Meta Description)
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
            placeholder="সার্চ ইঞ্জিনে দেখানোর জন্য সংক্ষিপ্ত বিবরণ..."
          />
        </div>

        {/* Status & Save */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium">স্ট্যাটাস:</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-300">
                <input type="radio" name="status" value="draft" checked={status === "draft"} onChange={() => setStatus("draft")} className="accent-cyan-500" />
                <FileText className="w-3.5 h-3.5" /> ড্রাফট
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-300">
                <input type="radio" name="status" value="published" checked={status === "published"} onChange={() => setStatus("published")} className="accent-green-500" />
                <Globe className="w-3.5 h-3.5 text-green-400" /> প্রকাশিত
              </label>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => handleSave("draft")}
                disabled={saving || !title.trim()}
                className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "সেভ হচ্ছে..." : "ড্রাফট সেভ"}
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={saving || !title.trim()}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {saved ? <CheckCircle2 className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                {saved ? "সেভ হয়েছে!" : (saving ? "প্রকাশ হচ্ছে..." : "প্রকাশ করুন")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PageEditorPage({ params }: { params?: PageEditorParams }) {
  return (
    <AdminGuard>
      <PageEditorContent params={params} />
    </AdminGuard>
  );
}
