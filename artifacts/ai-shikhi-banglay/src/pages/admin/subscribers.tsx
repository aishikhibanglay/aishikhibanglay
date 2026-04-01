import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Mail, Download } from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  subscribedAt: string;
}

function SubscriberListPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/subscribers", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const exportCSV = () => {
    const header = "id,email,subscribedAt\n";
    const rows = subscribers
      .map((s) => `${s.id},${s.email},${new Date(s.subscribedAt).toLocaleString("bn-BD")}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout title="সাবস্ক্রাইবার তালিকা">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">সকল সাবস্ক্রাইবার</h2>
                {!loading && (
                  <p className="text-gray-500 text-xs">{subscribers.length} জন সাবস্ক্রাইব করেছেন</p>
                )}
              </div>
            </div>
            {subscribers.length > 0 && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                CSV ডাউনলোড
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">লোড হচ্ছে...</div>
          ) : subscribers.length === 0 ? (
            <div className="p-16 text-center">
              <Mail className="w-14 h-14 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">এখনো কোনো সাবস্ক্রাইবার নেই</p>
              <p className="text-gray-700 text-xs mt-1">
                সাইটে নিউজলেটার ফর্মে কেউ সাবস্ক্রাইব করলে এখানে দেখাবে
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {subscribers.map((sub, i) => (
                <div
                  key={sub.id}
                  className="px-4 py-3 flex items-center gap-4 hover:bg-gray-800/40 transition-colors"
                >
                  <span className="text-gray-600 text-xs w-7 text-right flex-shrink-0">{i + 1}</span>
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-200 text-sm flex-1 truncate">{sub.email}</span>
                  <span className="text-gray-600 text-xs flex-shrink-0">
                    {new Date(sub.subscribedAt).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function SubscriberListPageWrapper() {
  return (
    <AdminGuard>
      <SubscriberListPage />
    </AdminGuard>
  );
}
