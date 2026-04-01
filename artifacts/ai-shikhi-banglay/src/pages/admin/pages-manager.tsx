import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocation } from "wouter";
import {
  Plus, Trash2, FileText, ExternalLink, Globe, Clock
} from "lucide-react";

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
    if (!confirm(`"${title}" পেজটি মুছে ফেলবেন?`)) return;
    const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) setPages((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout title="পেজ ম্যানেজার">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">সকল পেজ</h2>
          <button
            onClick={() => setLocation("/admin/pages/new")}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> নতুন পেজ তৈরি করুন
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-12">লোড হচ্ছে...</p>
        ) : pages.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">কোনো পেজ নেই।</p>
            <button
              onClick={() => setLocation("/admin/pages/new")}
              className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
            >
              প্রথম পেজটি তৈরি করুন →
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">
            {pages.map((page) => (
              <div key={page.id} className="px-5 py-4 flex items-center gap-4">
                <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{page.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      page.status === "published"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      {page.status === "published" ? "প্রকাশিত" : "ড্রাফট"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-gray-500 text-xs">/{page.slug}</span>
                    {page.status === "published" && (
                      <a
                        href={`/pages/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLocation(`/admin/pages/${page.id}/edit`)}
                    className="text-gray-400 hover:text-cyan-400 text-xs px-3 py-1.5 rounded border border-gray-700 hover:border-cyan-500 transition-colors"
                  >
                    সম্পাদনা
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
