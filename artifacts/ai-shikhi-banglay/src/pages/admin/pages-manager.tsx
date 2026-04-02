import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocation } from "wouter";
import {
  Plus, Trash2, FileText, ExternalLink, Shield, Pencil, Loader2
} from "lucide-react";
import { SYSTEM_PAGE_CONTENT, SYSTEM_PAGE_LIST } from "@/lib/systemPages";

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  status: "draft" | "published";
  createdAt: string;
}

function PagesManagerContent() {
  const [, setLocation] = useLocation();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    const res = await fetch("/api/admin/pages", { credentials: "include" });
    if (res.ok) setPages(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" মুছে ফেললে এই পেজটি ডিফল্ট কন্টেন্টে ফিরে যাবে। নিশ্চিত?`)) return;
    const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const customPages = pages.filter(
    (p) => !SYSTEM_PAGE_LIST.some((sp) => sp.slug === p.slug)
  );

  const systemPagesWithDb = SYSTEM_PAGE_LIST.map((sp) => ({
    ...sp,
    title: SYSTEM_PAGE_CONTENT[sp.slug].title,
    dbPage: pages.find((p) => p.slug === sp.slug) ?? null,
  }));

  return (
    <AdminLayout title="পেজ ম্যানেজার">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* ── System Pages ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <h2 className="text-white font-semibold text-sm">সিস্টেম পেজ</h2>
          </div>
          <p className="text-xs text-gray-500 mb-3 ml-6">
            "এডিট করুন" ক্লিক করলে সম্পাদক খুলবে — পরিবর্তন করে "প্রকাশ করুন" চাপলেই কেবল সেভ হবে। ফিরে গেলে কোনো পরিবর্তন হবে না।
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              </div>
            ) : systemPagesWithDb.map((sp) => (
              <div key={sp.slug} className="px-5 py-4 flex items-center gap-4">
                <FileText className="w-5 h-5 text-amber-500/60 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium text-sm">{sp.title}</span>
                    {sp.dbPage ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        sp.dbPage.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-700 text-gray-400"
                      }`}>
                        {sp.dbPage.status === "published" ? "✏️ কাস্টম কন্টেন্ট সক্রিয়" : "ড্রাফট"}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-700">
                        ডিফল্ট কন্টেন্ট
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-600 text-xs">{sp.url}</span>
                    <a href={sp.url} target="_blank" rel="noopener noreferrer"
                      className="text-gray-600 hover:text-cyan-400 transition-colors" title="পেজ দেখুন">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sp.dbPage ? (
                    <>
                      <button
                        onClick={() => setLocation(`/admin/pages/${sp.dbPage!.id}/edit`)}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-xs px-3 py-1.5 rounded border border-gray-700 hover:border-cyan-500 transition-colors"
                      >
                        <Pencil className="w-3 h-3" /> সম্পাদনা
                      </button>
                      <button
                        onClick={() => handleDelete(sp.dbPage!.id, sp.title)}
                        className="text-gray-600 hover:text-red-400 transition-colors" title="ডিফল্টে ফিরে যান"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    // Navigate to editor with ?system=slug — NO DB entry created yet
                    <button
                      onClick={() => setLocation(`/admin/pages/new?system=${sp.slug}`)}
                      className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> এডিট করুন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Custom Pages ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-sm">কাস্টম পেজ</h2>
            <button
              onClick={() => setLocation("/admin/pages/new")}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> নতুন পেজ
            </button>
          </div>

          {loading ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl py-8 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          ) : customPages.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
              <FileText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">কোনো কাস্টম পেজ নেই।</p>
              <button
                onClick={() => setLocation("/admin/pages/new")}
                className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
              >
                প্রথম পেজটি তৈরি করুন →
              </button>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">
              {customPages.map((page) => (
                <div key={page.id} className="px-5 py-4 flex items-center gap-4">
                  <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{page.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        page.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-700 text-gray-400"
                      }`}>
                        {page.status === "published" ? "প্রকাশিত" : "ড্রাফট"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-500 text-xs">/pages/{page.slug}</span>
                      {page.status === "published" && (
                        <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer"
                          className="text-gray-600 hover:text-cyan-400 transition-colors">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLocation(`/admin/pages/${page.id}/edit`)}
                      className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-xs px-3 py-1.5 rounded border border-gray-700 hover:border-cyan-500 transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> সম্পাদনা
                    </button>
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function PagesManagerPage() {
  return (
    <AdminGuard>
      <PagesManagerContent />
    </AdminGuard>
  );
}
