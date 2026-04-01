import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { api, type Post } from "@/lib/api";
import { useLocation } from "wouter";
import {
  PenSquare,
  Trash2,
  LogOut,
  Plus,
  BookOpen,
  FileText,
  Globe,
  Clock,
  BarChart2,
  Edit,
  Eye,
  Settings,
  Mail,
  Navigation,
  Layout,
} from "lucide-react";

function PostStatusBadge({ status }: { status: Post["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        status === "published"
          ? "bg-green-500/20 text-green-400"
          : "bg-yellow-500/20 text-yellow-400"
      }`}
    >
      {status === "published" ? (
        <>
          <Globe className="w-3 h-3" /> প্রকাশিত
        </>
      ) : (
        <>
          <Clock className="w-3 h-3" /> ড্রাফট
        </>
      )}
    </span>
  );
}

function AdminDashboard() {
  const { username, logout } = useAdmin();
  const [, setLocation] = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [subscribers, setSubscribers] = useState<{ id: number; email: string; subscribedAt: string }[]>([]);
  const [showSubscribers, setShowSubscribers] = useState(false);

  const loadPosts = async () => {
    try {
      const data = await api.adminListPosts();
      setPosts(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const loadSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/subscribers", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
        setSubscriberCount(data.length);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadPosts();
    loadSubscribers();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" পোস্টটি মুছে ফেলতে চান?`)) return;
    setDeleting(id);
    try {
      await api.adminDeletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("পোস্ট মুছতে সমস্যা হয়েছে");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <div>
              <h1 className="text-white font-bold text-sm">AI শিখি বাংলায়</h1>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              সাইট দেখুন
            </a>
            <span className="text-gray-600 text-sm">|</span>
            <button
              onClick={() => setLocation("/admin/settings")}
              className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
            >
              <Settings className="w-4 h-4" />
              সেটিংস
            </button>
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{posts.length}</p>
                <p className="text-gray-500 text-xs">মোট পোস্ট</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{published}</p>
                <p className="text-gray-500 text-xs">প্রকাশিত</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{drafts}</p>
                <p className="text-gray-500 text-xs">ড্রাফট</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSubscribers((v) => !v)}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-purple-500/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {subscriberCount === null ? "—" : subscriberCount}
                </p>
                <p className="text-gray-500 text-xs">সাবস্ক্রাইবার</p>
              </div>
            </div>
          </button>
        </div>

        {/* Subscriber List Panel */}
        {showSubscribers && (
          <div className="bg-gray-900 border border-purple-500/30 rounded-xl overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" />
                সাবস্ক্রাইবার তালিকা
                <span className="text-xs font-normal bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                  {subscribers.length} জন
                </span>
              </h2>
              <button
                onClick={() => setShowSubscribers(false)}
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                ✕ বন্ধ করুন
              </button>
            </div>
            {subscribers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Mail className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                <p>এখনো কোনো সাবস্ক্রাইবার নেই</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800 max-h-80 overflow-y-auto">
                {subscribers.map((sub, i) => (
                  <div key={sub.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-800/50 transition-colors">
                    <span className="text-gray-600 text-xs w-6 text-right">{i + 1}</span>
                    <div className="w-7 h-7 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-gray-200 text-sm flex-1">{sub.email}</span>
                    <span className="text-gray-600 text-xs">
                      {new Date(sub.subscribedAt).toLocaleDateString("bn-BD")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setLocation("/admin/pages")}
            className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-4 flex items-center gap-4 text-left transition-colors"
          >
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Layout className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">পেজ ম্যানেজার</p>
              <p className="text-gray-500 text-xs">নতুন পেজ তৈরি ও সম্পাদনা</p>
            </div>
          </button>
          <button
            onClick={() => setLocation("/admin/nav")}
            className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-4 flex items-center gap-4 text-left transition-colors"
          >
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Navigation className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">নেভিগেশন ম্যানেজার</p>
              <p className="text-gray-500 text-xs">মেনু ও ফুটার লিংক</p>
            </div>
          </button>
          <button
            onClick={() => setLocation("/admin/settings")}
            className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-4 flex items-center gap-4 text-left transition-colors"
          >
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">সাইট সেটিংস</p>
              <p className="text-gray-500 text-xs">সোশ্যাল, ল্যান্ডিং পেজ কন্টেন্ট</p>
            </div>
          </button>
        </div>

        {/* Posts List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-800">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <PenSquare className="w-5 h-5 text-cyan-400" />
              সব পোস্ট
            </h2>
            <button
              onClick={() => setLocation("/admin/posts/new")}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              নতুন পোস্ট
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">লোড হচ্ছে...</div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">এখনো কোনো পোস্ট নেই</p>
              <button
                onClick={() => setLocation("/admin/posts/new")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                প্রথম পোস্ট লিখুন
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium truncate">{post.title}</h3>
                      <PostStatusBadge status={post.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="bg-gray-800 px-2 py-0.5 rounded">{post.category}</span>
                      <span>{post.readTime} মিনিট পড়া</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {post.status === "published" && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="পোস্ট দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setLocation(`/admin/posts/${post.id}/edit`)}
                      className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="সম্পাদনা করুন"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deleting === post.id}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                      title="মুছুন"
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
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
