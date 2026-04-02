import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { invalidateSettingsCache } from "@/lib/useSiteSettings";
import { invalidateSocialLinksCache } from "@/lib/useSocialLinks";
import { invalidateNavItemsCache } from "@/lib/useNavItems";
import {
  Save, Plus, Trash2, Pencil, X, CheckCircle2,
  Globe, Youtube, Facebook, Twitter, Instagram, Music2, Linkedin, Ghost,
  GripVertical, ToggleLeft, ToggleRight, ExternalLink, Loader2,
} from "lucide-react";

// ─── SOCIAL ICON HELPERS ──────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { value: "youtube", label: "YouTube", Icon: Youtube },
  { value: "facebook", label: "Facebook", Icon: Facebook },
  { value: "twitter", label: "X (Twitter)", Icon: Twitter },
  { value: "instagram", label: "Instagram", Icon: Instagram },
  { value: "tiktok", label: "TikTok", Icon: Music2 },
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { value: "github", label: "GitHub", Icon: Ghost },
  { value: "link", label: "অন্যান্য", Icon: Globe },
];
function SocialIcon({ icon }: { icon: string }) {
  const found = ICON_OPTIONS.find((o) => o.value === icon);
  const Icon = found?.Icon ?? Globe;
  return <Icon className="w-4 h-4" />;
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface SocialLink { id: number; label: string; url: string; icon: string; displayOrder: number; }
interface NavItem { id: number; label: string; href: string; section: string; position: number; isActive: boolean; openInNewTab: boolean; }

// ─── SMALL REUSABLES ──────────────────────────────────────────────────────────
function Field({ label, hint, value, onChange, placeholder, multiline }: {
  label: string; hint?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-none";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
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

// ─── SOCIAL LINKS INLINE ──────────────────────────────────────────────────────
function SocialLinksPanel({ links, onAdd, onEdit, onDelete }: {
  links: SocialLink[];
  onAdd: (d: Omit<SocialLink, "id">) => Promise<void>;
  onEdit: (id: number, d: Omit<SocialLink, "id">) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ label: "", url: "", icon: "link", displayOrder: 0 });

  const openAdd = () => { setForm({ label: "", url: "", icon: "link", displayOrder: links.length }); setAdding(true); setEditId(null); };
  const openEdit = (l: SocialLink) => { setForm({ label: l.label, url: l.url, icon: l.icon, displayOrder: l.displayOrder }); setEditId(l.id); setAdding(false); };

  const IconPreview = ICON_OPTIONS.find((o) => o.value === form.icon)?.Icon ?? Globe;

  return (
    <div className="space-y-2">
      {links.map((link) => editId === link.id ? (
        <SocialForm key={link.id} form={form} setForm={setForm} IconPreview={IconPreview}
          onSave={async () => { await onEdit(link.id, form); setEditId(null); }}
          onCancel={() => setEditId(null)} />
      ) : (
        <div key={link.id} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2.5 group">
          <span className="text-cyan-400"><SocialIcon icon={link.icon} /></span>
          <span className="text-sm text-white flex-1">{link.label}</span>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-cyan-400 truncate max-w-[160px] transition-colors">{link.url}</a>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => openEdit(link)} className="p-1.5 rounded hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
            <button onClick={() => onDelete(link.id)} className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      ))}

      {adding ? (
        <SocialForm form={form} setForm={setForm} IconPreview={IconPreview}
          onSave={async () => { await onAdd(form); setAdding(false); }}
          onCancel={() => setAdding(false)} />
      ) : (
        <button onClick={openAdd} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-cyan-400 hover:border-cyan-500 text-sm transition-colors">
          <Plus className="w-4 h-4" /> সোশ্যাল লিঙ্ক যোগ করুন
        </button>
      )}
    </div>
  );
}

function SocialForm({ form, setForm, IconPreview, onSave, onCancel }: {
  form: { label: string; url: string; icon: string; displayOrder: number };
  setForm: React.Dispatch<React.SetStateAction<{ label: string; url: string; icon: string; displayOrder: number }>>;
  IconPreview: React.ElementType; onSave: () => Promise<void>; onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  return (
    <div className="bg-gray-800 border border-cyan-500/20 rounded-lg p-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          placeholder="নাম (যেমন: YouTube)" className="bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
        <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          placeholder="https://..." className="bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
      </div>
      <div className="flex items-center gap-2">
        <IconPreview className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <select value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
          className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500">
          {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))}
          placeholder="ক্রম" className="w-20 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-1.5 rounded text-gray-400 hover:text-white text-xs transition-colors"><X className="w-3 h-3 inline" /> বাতিল</button>
        <button onClick={async () => { setSaving(true); await onSave(); setSaving(false); }}
          disabled={!form.label || !form.url || saving}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-xs font-medium transition-colors">
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} সেভ
        </button>
      </div>
    </div>
  );
}

// ─── NAV LINKS INLINE ─────────────────────────────────────────────────────────
function NavLinksPanel({ section, items, onAdd, onEdit, onDelete, onToggle, onMoveUp }: {
  section: string; items: NavItem[];
  onAdd: (section: string, label: string, href: string, newTab: boolean) => Promise<void>;
  onEdit: (id: number, label: string, href: string, newTab: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggle: (item: NavItem) => Promise<void>;
  onMoveUp: (item: NavItem, sectionItems: NavItem[]) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ label: "", href: "", newTab: false });

  const sorted = [...items].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-2">
      {sorted.map((item) => editId === item.id ? (
        <div key={item.id} className="bg-gray-800 border border-cyan-500/20 rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="লেবেল" className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
            <input value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              placeholder="URL (যেমন: /about)" className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.newTab} onChange={(e) => setForm((f) => ({ ...f, newTab: e.target.checked }))} className="accent-cyan-500" />
              নতুন ট্যাবে খুলুন
            </label>
            <div className="flex gap-2">
              <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded text-gray-400 hover:text-white text-xs transition-colors">বাতিল</button>
              <button onClick={async () => { await onEdit(item.id, form.label, form.href, form.newTab); setEditId(null); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium transition-colors">
                <Save className="w-3 h-3" /> সেভ
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div key={item.id} className={`flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2.5 group ${!item.isActive ? "opacity-50" : ""}`}>
          <button onClick={() => onMoveUp(item, sorted)} className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0">
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-sm text-white flex-1">{item.label}</span>
          <span className="text-xs text-gray-500">{item.href}</span>
          {item.openInNewTab && <ExternalLink className="w-3 h-3 text-gray-600" />}
          <div className="flex gap-1 ml-1">
            <button onClick={() => onToggle(item)} className="text-gray-500 hover:text-cyan-400 transition-colors">
              {item.isActive ? <ToggleRight className="w-4 h-4 text-cyan-400" /> : <ToggleLeft className="w-4 h-4" />}
            </button>
            <button onClick={() => { setForm({ label: item.label, href: item.href, newTab: item.openInNewTab }); setEditId(item.id); }}
              className="p-1 rounded hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(item.id)} className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}

      {adding ? (
        <div className="bg-gray-800 border border-cyan-500/20 rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="লেবেল (যেমন: আমাদের সম্পর্কে)" autoFocus
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
            <input value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              placeholder="/about অথবা https://..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.newTab} onChange={(e) => setForm((f) => ({ ...f, newTab: e.target.checked }))} className="accent-cyan-500" />
              নতুন ট্যাবে খুলুন
            </label>
            <div className="flex gap-2">
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded text-gray-400 hover:text-white text-xs transition-colors">বাতিল</button>
              <button onClick={async () => { await onAdd(section, form.label, form.href, form.newTab); setAdding(false); setForm({ label: "", href: "", newTab: false }); }}
                disabled={!form.label || !form.href}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-xs font-medium transition-colors">
                <Plus className="w-3 h-3" /> যোগ করুন
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => { setForm({ label: "", href: "", newTab: false }); setAdding(true); setEditId(null); }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-cyan-400 hover:border-cyan-500 text-sm transition-colors">
          <Plus className="w-4 h-4" /> নতুন লিংক যোগ করুন
        </button>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function FooterManagerContent() {
  const [settings, setSettings] = useState({
    footer_description: "", footer_copyright: "", footer_tagline: "",
    footer_main_title: "", footer_legal_title: "",
  });
  const [allSettings, setAllSettings] = useState<Record<string, string>>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const fetchAll = async () => {
    try {
      const [settRes, socRes, navRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/social-links"),
        fetch("/api/admin/nav-items", { credentials: "include" }),
      ]);
      if (settRes.ok) {
        const d = await settRes.json();
        setAllSettings(d);
        setSettings({
          footer_description: d.footer_description ?? "",
          footer_copyright: d.footer_copyright ?? "",
          footer_tagline: d.footer_tagline ?? "",
          footer_main_title: d.footer_main_title ?? "",
          footer_legal_title: d.footer_legal_title ?? "",
        });
      }
      if (socRes.ok) setSocialLinks(await socRes.json());
      if (navRes.ok) setNavItems(await navRes.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const footerMain = navItems.filter((i) => i.section === "footer_main").sort((a, b) => a.position - b.position);
  const footerLegal = navItems.filter((i) => i.section === "footer_legal").sort((a, b) => a.position - b.position);

  // Save footer text settings
  const handleSaveSettings = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ ...allSettings, ...settings }),
    });
    if (res.ok) { invalidateSettingsCache(); showToast("ফুটার সেটিংস সেভ হয়েছে!"); }
    setSaving(false);
  };

  // Social link operations
  const handleSocialAdd = async (data: Omit<SocialLink, "id">) => {
    const res = await fetch("/api/admin/social-links", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(data) });
    if (res.ok) { invalidateSocialLinksCache(); await fetchAll(); showToast("সোশ্যাল লিঙ্ক যোগ হয়েছে!"); }
  };
  const handleSocialEdit = async (id: number, data: Omit<SocialLink, "id">) => {
    const res = await fetch(`/api/admin/social-links/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(data) });
    if (res.ok) { invalidateSocialLinksCache(); await fetchAll(); showToast("লিঙ্ক আপডেট হয়েছে!"); }
  };
  const handleSocialDelete = async (id: number) => {
    if (!confirm("মুছে ফেলবেন?")) return;
    const res = await fetch(`/api/admin/social-links/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { invalidateSocialLinksCache(); await fetchAll(); showToast("লিঙ্ক মুছে ফেলা হয়েছে"); }
  };

  // Nav item operations
  const handleNavAdd = async (section: string, label: string, href: string, newTab: boolean) => {
    const existing = navItems.filter((i) => i.section === section);
    const res = await fetch("/api/admin/nav-items", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ label, href, section, position: existing.length + 1, isActive: true, openInNewTab: newTab }) });
    if (res.ok) { invalidateNavItemsCache(); await fetchAll(); showToast("লিংক যোগ হয়েছে!"); }
  };
  const handleNavEdit = async (id: number, label: string, href: string, newTab: boolean) => {
    const res = await fetch(`/api/admin/nav-items/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ label, href, openInNewTab: newTab }) });
    if (res.ok) { invalidateNavItemsCache(); await fetchAll(); showToast("লিংক আপডেট হয়েছে!"); }
  };
  const handleNavDelete = async (id: number) => {
    if (!confirm("লিংকটি মুছে ফেলবেন?")) return;
    await fetch(`/api/admin/nav-items/${id}`, { method: "DELETE", credentials: "include" });
    invalidateNavItemsCache(); await fetchAll(); showToast("লিংক মুছে ফেলা হয়েছে");
  };
  const handleNavToggle = async (item: NavItem) => {
    const res = await fetch(`/api/admin/nav-items/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ isActive: !item.isActive }) });
    if (res.ok) { invalidateNavItemsCache(); await fetchAll(); }
  };
  const handleNavMoveUp = async (item: NavItem, sectionItems: NavItem[]) => {
    const idx = sectionItems.findIndex((i) => i.id === item.id);
    if (idx === 0) return;
    const above = sectionItems[idx - 1];
    await Promise.all([
      fetch(`/api/admin/nav-items/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ position: above.position }) }),
      fetch(`/api/admin/nav-items/${above.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ position: item.position }) }),
    ]);
    invalidateNavItemsCache(); await fetchAll();
  };

  if (loading) return <AdminLayout title="ফুটার ম্যানেজার"><div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-gray-500" /></div></AdminLayout>;

  return (
    <AdminLayout title="ফুটার ম্যানেজার">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {toast && (
          <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-gray-800 border border-green-500/40 text-green-400 px-4 py-2.5 rounded-xl shadow-xl text-sm">
            <CheckCircle2 className="w-4 h-4" />{toast}
          </div>
        )}

        {/* ── About/Description ── */}
        <SectionCard title="ফুটার বিবরণ ও সোশ্যাল লিঙ্ক">
          <Field label="ফুটারের বিবরণ" value={settings.footer_description} onChange={(v) => setSettings((s) => ({ ...s, footer_description: v }))} placeholder="সাইট সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন..." multiline />
          <div className="border-t border-gray-800 pt-4">
            <p className="text-xs font-medium text-gray-400 mb-3">সোশ্যাল মিডিয়া আইকন</p>
            <SocialLinksPanel links={socialLinks} onAdd={handleSocialAdd} onEdit={handleSocialEdit} onDelete={handleSocialDelete} />
          </div>
        </SectionCard>

        {/* ── Footer Main Links ── */}
        <SectionCard title="গুরুত্বপূর্ণ পেজ সেকশন">
          <Field label="সেকশনের শিরোনাম" value={settings.footer_main_title} onChange={(v) => setSettings((s) => ({ ...s, footer_main_title: v }))} placeholder="গুরুত্বপূর্ণ পেজ" />
          <div className="border-t border-gray-800 pt-3">
            <p className="text-xs font-medium text-gray-400 mb-3">পেজের লিংকগুলো</p>
            <NavLinksPanel section="footer_main" items={footerMain} onAdd={handleNavAdd} onEdit={handleNavEdit} onDelete={handleNavDelete} onToggle={handleNavToggle} onMoveUp={handleNavMoveUp} />
          </div>
        </SectionCard>

        {/* ── Footer Legal Links ── */}
        <SectionCard title="আইনি তথ্য সেকশন">
          <Field label="সেকশনের শিরোনাম" value={settings.footer_legal_title} onChange={(v) => setSettings((s) => ({ ...s, footer_legal_title: v }))} placeholder="আইনি তথ্য" />
          <div className="border-t border-gray-800 pt-3">
            <p className="text-xs font-medium text-gray-400 mb-3">পেজের লিংকগুলো</p>
            <NavLinksPanel section="footer_legal" items={footerLegal} onAdd={handleNavAdd} onEdit={handleNavEdit} onDelete={handleNavDelete} onToggle={handleNavToggle} onMoveUp={handleNavMoveUp} />
          </div>
        </SectionCard>

        {/* ── Copyright & Tagline ── */}
        <SectionCard title="কপিরাইট ও ট্যাগলাইন">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="কপিরাইট টেক্সট" value={settings.footer_copyright} onChange={(v) => setSettings((s) => ({ ...s, footer_copyright: v }))} placeholder="AI শিখি বাংলায়। সর্বস্বত্ব সংরক্ষিত।" />
            <Field label="ফুটার ট্যাগলাইন" value={settings.footer_tagline} onChange={(v) => setSettings((s) => ({ ...s, footer_tagline: v }))} placeholder="তৈরি করা হয়েছে ভালোবাসার সাথে..." />
          </div>
        </SectionCard>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={handleSaveSettings} disabled={saving}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> সেভ হচ্ছে...</> : <><Save className="w-4 h-4" /> ফুটার সেটিংস সেভ করুন</>}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function FooterManagerPage() {
  return <AdminGuard><FooterManagerContent /></AdminGuard>;
}
