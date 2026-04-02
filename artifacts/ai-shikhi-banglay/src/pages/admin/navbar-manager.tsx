import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { invalidateSettingsCache } from "@/lib/useSiteSettings";
import { invalidateNavItemsCache } from "@/lib/useNavItems";
import {
  Save, Plus, Trash2, Pencil, X, CheckCircle2,
  Youtube, GripVertical, ToggleLeft, ToggleRight, ExternalLink, Loader2,
} from "lucide-react";

interface NavItem { id: number; label: string; href: string; section: string; position: number; isActive: boolean; openInNewTab: boolean; }

function Field({ label, hint, value, onChange, placeholder }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500" />
      {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
    </div>
  );
}

function SectionCard({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <h3 className="text-white font-semibold text-sm flex items-center gap-2">{title}</h3>
      {children}
    </div>
  );
}

function NavbarManagerContent() {
  const [settings, setSettings] = useState({ youtube_subscribe_url: "", youtube_channel_url: "", site_name: "" });
  const [allSettings, setAllSettings] = useState<Record<string, string>>({});
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ label: "", href: "", newTab: false });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchAll = async () => {
    try {
      const [settRes, navRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/admin/nav-items", { credentials: "include" }),
      ]);
      if (settRes.ok) {
        const d = await settRes.json();
        setAllSettings(d);
        setSettings({ youtube_subscribe_url: d.youtube_subscribe_url ?? "", youtube_channel_url: d.youtube_channel_url ?? "", site_name: d.site_name ?? "" });
      }
      if (navRes.ok) setNavItems(await navRes.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const navbarItems = navItems.filter((i) => i.section === "navbar").sort((a, b) => a.position - b.position);

  const handleSaveSettings = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ ...allSettings, ...settings }),
    });
    if (res.ok) { invalidateSettingsCache(); showToast("নেভবার সেটিংস সেভ হয়েছে!"); }
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!form.label || !form.href) return;
    const res = await fetch("/api/admin/nav-items", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ label: form.label, href: form.href, section: "navbar", position: navbarItems.length + 1, isActive: true, openInNewTab: form.newTab }) });
    if (res.ok) { invalidateNavItemsCache(); await fetchAll(); setAdding(false); setForm({ label: "", href: "", newTab: false }); showToast("লিংক যোগ হয়েছে!"); }
  };
  const handleEdit = async (id: number) => {
    const res = await fetch(`/api/admin/nav-items/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ label: form.label, href: form.href, openInNewTab: form.newTab }) });
    if (res.ok) { invalidateNavItemsCache(); await fetchAll(); setEditId(null); showToast("লিংক আপডেট হয়েছে!"); }
  };
  const handleDelete = async (id: number) => {
    if (!confirm("লিংকটি মুছে ফেলবেন?")) return;
    await fetch(`/api/admin/nav-items/${id}`, { method: "DELETE", credentials: "include" });
    invalidateNavItemsCache(); await fetchAll(); showToast("লিংক মুছে ফেলা হয়েছে");
  };
  const handleToggle = async (item: NavItem) => {
    const res = await fetch(`/api/admin/nav-items/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ isActive: !item.isActive }) });
    if (res.ok) { invalidateNavItemsCache(); await fetchAll(); }
  };
  const handleMoveUp = async (item: NavItem) => {
    const idx = navbarItems.findIndex((i) => i.id === item.id);
    if (idx === 0) return;
    const above = navbarItems[idx - 1];
    await Promise.all([
      fetch(`/api/admin/nav-items/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ position: above.position }) }),
      fetch(`/api/admin/nav-items/${above.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ position: item.position }) }),
    ]);
    invalidateNavItemsCache(); await fetchAll();
  };

  if (loading) return <AdminLayout title="নেভবার ম্যানেজার"><div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-gray-500" /></div></AdminLayout>;

  return (
    <AdminLayout title="নেভবার ম্যানেজার">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {toast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-gray-800 border border-green-500/40 text-green-400 px-4 py-2.5 rounded-xl shadow-xl text-sm">
            <CheckCircle2 className="w-4 h-4" />{toast}
          </div>
        )}

        {/* ── Subscribe Button ── */}
        <SectionCard title={<><Youtube className="w-4 h-4 text-red-400" /> সাবস্ক্রাইব বাটন</>}>
          <p className="text-xs text-gray-500 -mt-2">নেভিগেশন বারের ডান দিকে "সাবস্ক্রাইব করুন" বাটনের লিঙ্ক</p>
          <Field label="সাবস্ক্রাইব URL" value={settings.youtube_subscribe_url} onChange={(v) => setSettings((s) => ({ ...s, youtube_subscribe_url: v }))} placeholder="https://www.youtube.com/@আপনার_চ্যানেল?sub_confirmation=1" />
          <Field label="YouTube চ্যানেল URL" hint="সাবস্ক্রাইব URL না থাকলে এটি ব্যবহার করা হবে" value={settings.youtube_channel_url} onChange={(v) => setSettings((s) => ({ ...s, youtube_channel_url: v }))} placeholder="https://www.youtube.com/@আপনার_চ্যানেল" />
        </SectionCard>

        {/* ── Nav Links ── */}
        <SectionCard title="নেভিগেশন মেনু লিংক">
          <p className="text-xs text-gray-500 -mt-2">উপরের মেনুতে যে লিংকগুলো দেখাবে</p>

          <div className="space-y-2">
            {navbarItems.map((item) => editId === item.id ? (
              <div key={item.id} className="bg-gray-800 border border-cyan-500/20 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="লেবেল"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  <input value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))} placeholder="/about"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={form.newTab} onChange={(e) => setForm((f) => ({ ...f, newTab: e.target.checked }))} className="accent-cyan-500" />
                    নতুন ট্যাবে খুলুন
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded text-gray-400 hover:text-white text-xs">বাতিল</button>
                    <button onClick={() => handleEdit(item.id)} className="flex items-center gap-1 px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium">
                      <Save className="w-3 h-3" /> সেভ
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={item.id} className={`flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2.5 group ${!item.isActive ? "opacity-50" : ""}`}>
                <button onClick={() => handleMoveUp(item)} className="text-gray-600 hover:text-gray-400 flex-shrink-0"><GripVertical className="w-4 h-4" /></button>
                <span className="text-sm text-white flex-1">{item.label}</span>
                <span className="text-xs text-gray-500">{item.href}</span>
                {item.openInNewTab && <ExternalLink className="w-3 h-3 text-gray-600" />}
                <div className="flex gap-1">
                  <button onClick={() => handleToggle(item)} className="text-gray-500 hover:text-cyan-400">
                    {item.isActive ? <ToggleRight className="w-4 h-4 text-cyan-400" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setForm({ label: item.label, href: item.href, newTab: item.openInNewTab }); setEditId(item.id); setAdding(false); }}
                    className="p-1 rounded hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 opacity-0 group-hover:opacity-100">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {adding ? (
              <div className="bg-gray-800 border border-cyan-500/20 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="লেবেল (যেমন: হোম)" autoFocus
                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  <input value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))} placeholder="/ অথবা /blog"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={form.newTab} onChange={(e) => setForm((f) => ({ ...f, newTab: e.target.checked }))} className="accent-cyan-500" />
                    নতুন ট্যাবে খুলুন
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setAdding(false)} className="px-3 py-1.5 text-gray-400 hover:text-white text-xs rounded">বাতিল</button>
                    <button onClick={handleAdd} disabled={!form.label || !form.href}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-xs font-medium">
                      <Plus className="w-3 h-3" /> যোগ করুন
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => { setForm({ label: "", href: "", newTab: false }); setAdding(true); setEditId(null); }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-cyan-400 hover:border-cyan-500 text-sm transition-colors">
                <Plus className="w-4 h-4" /> নতুন মেনু লিংক যোগ করুন
              </button>
            )}
          </div>
        </SectionCard>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={handleSaveSettings} disabled={saving}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> সেভ হচ্ছে...</> : <><Save className="w-4 h-4" /> নেভবার সেটিংস সেভ করুন</>}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function NavbarManagerPage() {
  return <AdminGuard><NavbarManagerContent /></AdminGuard>;
}
