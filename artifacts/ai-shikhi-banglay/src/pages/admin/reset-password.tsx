import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { BookOpen, KeyRound, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password-via-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newUsername, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "রিসেট ব্যর্থ হয়েছে");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "রিসেট ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">AI শিখি বাংলায়</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-300">Admin Panel</h1>
          <p className="text-gray-500 mt-1 text-sm">নতুন পাসওয়ার্ড সেট করুন</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {!token ? (
            <div className="text-center py-4">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-400 font-medium">অবৈধ বা মেয়াদোত্তীর্ণ লিংক</p>
              <button
                onClick={() => setLocation("/admin/login")}
                className="mt-4 text-cyan-400 text-sm hover:underline"
              >
                লগইন পেজে যান
              </button>
            </div>
          ) : done ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold text-lg mb-1">পাসওয়ার্ড পরিবর্তন হয়েছে!</h3>
              <p className="text-gray-400 text-sm mb-6">নতুন ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন করুন।</p>
              <button
                onClick={() => setLocation("/admin/login")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                লগইন করুন
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">নতুন পাসওয়ার্ড সেট করুন</h3>
                  <p className="text-gray-500 text-xs">ইমেইল লিংকের মাধ্যমে রিসেট</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">নতুন ইউজারনেম</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    placeholder="admin"
                    required
                    minLength={3}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">নতুন পাসওয়ার্ড</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5" />
                      পাসওয়ার্ড রিসেট করুন
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          AI শিখি বাংলায় • Admin Panel
        </p>
      </div>
    </div>
  );
}
