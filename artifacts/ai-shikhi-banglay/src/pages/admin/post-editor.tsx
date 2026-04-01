import { useState, useEffect, useCallback } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RichEditor } from "@/components/admin/RichEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { api, type Post, type CreatePostData } from "@/lib/api";
import { useLocation } from "wouter";
import {
  Globe,
  Clock,
  Save,
  ImageIcon,
  Trash2,
  RefreshCw,
} from "lucide-react";

const CATEGORIES = [
  "টিউটোরিয়াল",
  "টুলস",
  "Prompt",
  "আয়",
  "নিউজ",
  "অন্যান্য",
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    // Keep Bengali Unicode (U+0980–U+09FF), ASCII word chars, spaces, hyphens
    .replace(/[^\u0980-\u09FF\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface PostEditorProps {
  postId?: number;
}

function PostEditorInner({ postId }: PostEditorProps) {
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [imageInsertMode, setImageInsertMode] = useState<"cover" | "inline">("cover");
  const [editorInsertFn, setEditorInsertFn] = useState<((url: string) => void) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<CreatePostData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0],
    coverImage: null,
    status: "draft",
    readTime: 5,
  });

  useEffect(() => {
    if (postId) {
      api.adminGetPost(postId).then((post) => {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          coverImage: post.coverImage ?? null,
          status: post.status,
          readTime: post.readTime,
        });
      });
    }
  }, [postId]);

  const update = <K extends keyof CreatePostData>(key: K, value: CreatePostData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: !postId ? generateSlug(title) : prev.slug,
    }));
  };

  const handleContentChange = (html: string) => {
    setForm((prev) => ({
      ...prev,
      content: html,
      readTime: estimateReadTime(html),
    }));
    setSaved(false);
  };

  const handleSave = async (status?: Post["status"]) => {
    const saveStatus = status ?? form.status;
    setError(null);
    setSaving(true);

    try {
      const data = { ...form, status: saveStatus };
      if (postId) {
        await api.adminUpdatePost(postId, data);
      } else {
        const created = await api.adminCreatePost(data);
        setLocation(`/admin/posts/${created.id}/edit`);
        return;
      }
      setSaved(true);
      setForm((prev) => ({ ...prev, status: saveStatus }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "সেভ করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const openCoverImageUploader = () => {
    setImageInsertMode("cover");
    setEditorInsertFn(null);
    setShowImageUploader(true);
  };

  const openInlineImageUploader = (insertFn: (url: string) => void) => {
    setImageInsertMode("inline");
    setEditorInsertFn(() => insertFn);
    setShowImageUploader(true);
  };

  const handleImageUploaded = (objectPath: string) => {
    if (imageInsertMode === "cover") {
      update("coverImage", objectPath);
    } else if (editorInsertFn) {
      editorInsertFn(objectPath);
    }
  };

  return (
    <AdminLayout title={postId ? "পোস্ট সম্পাদনা" : "নতুন পোস্ট"}>
      {/* Sticky action bar */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10 px-4 py-2.5 flex items-center justify-end gap-2">
        {saved && (
          <span className="text-green-400 text-sm flex items-center gap-1 mr-auto">
            <RefreshCw className="w-3 h-3" /> সেভ হয়েছে
          </span>
        )}
        <button
          onClick={() => handleSave("draft")}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50"
        >
          <Clock className="w-4 h-4" />
          ড্রাফট সেভ
        </button>
        <button
          onClick={() => handleSave("published")}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          প্রকাশ করুন
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="পোস্টের শিরোনাম লিখুন..."
              className="w-full bg-transparent text-white text-2xl font-bold placeholder-gray-600 border-none outline-none"
            />
            <div className="h-px bg-gray-800 mt-3" />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              সারসংক্ষেপ
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="পোস্টের সংক্ষিপ্ত বিবরণ (ব্লগ লিস্টে দেখাবে)..."
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Rich Editor */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              বিষয়বস্তু
            </label>
            <RichEditor
              content={form.content}
              onChange={handleContentChange}
              onImageInsert={(insertFn) => {
                openInlineImageUploader(insertFn);
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-medium mb-3 text-sm">স্ট্যাটাস</h3>
            <div className="space-y-2">
              {(["draft", "published"] as const).map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => update("status", s)}
                    className="text-cyan-500"
                  />
                  <span className="text-gray-300 text-sm">
                    {s === "published" ? (
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-green-400" /> প্রকাশিত
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-yellow-400" /> ড্রাফট
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-medium mb-3 text-sm">ক্যাটাগরি</h3>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Slug */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-medium mb-3 text-sm">URL Slug</h3>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500"
              placeholder="post-url-slug"
            />
            <p className="text-gray-600 text-xs mt-1">/blog/{form.slug || "..."}</p>
          </div>

          {/* Read Time */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-medium mb-3 text-sm">পড়ার সময়</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={60}
                value={form.readTime}
                onChange={(e) => update("readTime", parseInt(e.target.value) || 1)}
                className="w-20 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
              />
              <span className="text-gray-500 text-sm">মিনিট</span>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-medium mb-3 text-sm">কভার ছবি</h3>
            {form.coverImage ? (
              <div className="relative">
                <img
                  src={form.coverImage}
                  alt="Cover"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => update("coverImage", null)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={openCoverImageUploader}
                className="w-full border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center gap-2 text-gray-500 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs">ছবি আপলোড করুন</span>
              </button>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            সেভ করুন
          </button>
        </div>
      </div>

      {showImageUploader && (
        <ImageUploader
          onUploaded={handleImageUploaded}
          onClose={() => setShowImageUploader(false)}
        />
      )}
    </AdminLayout>
  );
}

export default function PostEditorPage({ params }: { params?: { id?: string } }) {
  const postId = params?.id ? parseInt(params.id) : undefined;
  return (
    <AdminGuard>
      <PostEditorInner postId={postId} />
    </AdminGuard>
  );
}
