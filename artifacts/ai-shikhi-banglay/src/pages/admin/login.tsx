import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { useLocation } from "wouter";
import { LogIn, Eye, EyeOff, BookOpen, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";

type View = "login" | "forgot";

function LoginForm({ onSwitchView }: { onSwitchView: () => void }) {
  const { login } = useAdmin();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      setLocation("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "লগইন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">ইউজারনেম</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            placeholder="admin"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">পাসওয়ার্ড</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              <LogIn className="w-5 h-5" />
              লগইন করুন
            </>
          )}
        </button>
      </form>

      <div className="mt-5 text-center">
        <button
          onClick={onSwitchView}
          className="text-gray-500 hover:text-cyan-400 text-sm transition-colors"
        >
          পাসওয়ার্ড ভুলে গেছেন?
        </button>
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "সমস্যা হয়েছে");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <h3 className="text-white font-semibold text-lg mb-1">ইমেইল পাঠানো হয়েছে!</h3>
        <p className="text-gray-400 text-sm mb-2">
          আপনার ইমেইলে একটি পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।
        </p>
        <p className="text-gray-600 text-xs mb-6">লিংকটি ১৫ মিনিট পর্যন্ত কার্যকর থাকবে।</p>
        <button
          onClick={onBack}
          className="text-cyan-400 text-sm hover:underline"
        >
          লগইন পেজে যান
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        লগইনে ফিরুন
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">পাসওয়ার্ড রিসেট</h3>
          <p className="text-gray-500 text-xs">ইমেইলে রিসেট লিংক পাঠানো হবে</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">রেজিস্টার্ড ইমেইল</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            placeholder="আপনার admin ইমেইল দিন"
            required
            autoFocus
          />
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
              রিসেট লিংক পাঠান
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function AdminLogin() {
  const [view, setView] = useState<View>("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">AI শিখি বাংলায়</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-300">Admin Panel</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {view === "login" ? "আপনার অ্যাকাউন্টে লগইন করুন" : "পাসওয়ার্ড পুনরুদ্ধার করুন"}
          </p>
        </div>

        {view === "login" ? (
          <LoginForm onSwitchView={() => setView("forgot")} />
        ) : (
          <ForgotPasswordForm onBack={() => setView("login")} />
        )}

        <p className="text-center text-gray-600 text-xs mt-6">
          AI শিখি বাংলায় • Admin Panel
        </p>
      </div>
    </div>
  );
}
