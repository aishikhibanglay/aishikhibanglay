import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLocation } from "wouter";
import { invalidateNavItemsCache } from "@/lib/useNavItems";
import {
  Plus, Trash2, Save, ExternalLink, ToggleLeft, ToggleRight, GripVertical, ChevronUp, Edit2
} from "lucide-react";

interface NavItem {
  id: number;
  label: string;
  href: string;
  section: "navbar" | "footer_main" | "footer_legal";
  position: number;
  isActive: boolean;
  openInNewTab: boolean;
}

const SECTION_LABELS: Record<string, string> = {
  navbar: "নেভিগেশন বার (উপরে)",
  footer_main: "ফুটার — গুরুত্বপূর্ণ পেজ",
  footer_legal: "ফুটার — আইনি তথ্য",
};

const SECTIONS = ["navbar", "footer_main", "footer_legal"] as const;

function NavManagerContent() {
  const [, setLocation] = useLocation();
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [addingSection, setAddingSection] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ label: "", href: "", openInNewTab: false });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<NavItem>>({});

  const fetchItems = async () => {
    const res = await fetch("/api/admin/nav-items", { credentials: "include" });
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const bySection = (section: string) =>
    items.filter((i) => i.section === section).sort((a, b) => a.position - b.position);

  const handleAdd = async (section: string) => {
    if (!newItem.label || !newItem.href) return;
    setSaving(-1);
    const existing = bySection(section);
    const res = await fetch("/api/admin/nav-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        label: newItem.label,
        href: newItem.href,
        section,
        position: existing.length + 1,
        isActive: true,
        openInNewTab: newItem.openInNewTab,
      }),
    });
    if (res.ok) {
      setNewItem({ label: "", href: "", openInNewTab: false });
      setAddingSection(null);
      await fetchItems();
      invalidateNavItemsCache();
    }
    setSaving(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই লিংকটি মুছে ফেলবেন?")) return;
    await fetch(`/api/admin/nav-items/${id}`, { method: "DELETE", credentials: "include" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    invalidateNavItemsCache();
  };

  const handleToggleActive = async (item: NavItem) => {
    const res = await fetch(`/api/admin/nav-items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
      invalidateNavItemsCache();
    }
  };

  const handleEditSave = async (id: number) => {
    setSaving(id);
    const res = await fetch(`/api/admin/nav-items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => i.id === id ? updated : i));
      setEditingId(null);
      invalidateNavItemsCache();
    }
    setSaving(null);
  };

  const handleMoveUp = async (item: NavItem, sectionItems: NavItem[]) => {
    const idx = sectionItems.findIndex((i) => i.id === item.id);
    if (idx === 0) return;
    const above = sectionItems[idx - 1];
    await Promise.all([
      fetch(`/api/admin/nav-items/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ position: above.position }) }),
      fetch(`/api/admin/nav-items/${above.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ position: item.position }) }),
    ]);
    await fetchItems();
    invalidateNavItemsCache();
  };

  return (
    <AdminLayout title="নেভিগেশন ম্যানেজার">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <p className="text-gray-400 text-center py-12">লোড হচ্ছে...</p>
        ) : (
          SECTIONS.map((section) => {
            const sectionItems = bySection(section);
            return (
              <div key={section} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-white font-semibold">{SECTION_LABELS[section]}</h2>
                  <button
                    onClick={() => { setAddingSection(section); setNewItem({ label: "", href: "", openInNewTab: false }); }}
                    className="flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-sm px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" /> নতুন লিংক
                  </button>
                </div>

                {sectionItems.length === 0 && addingSection !== section && (
                  <p className="text-gray-500 text-sm text-center py-6">কোনো লিংক নেই</p>
                )}

                <div className="divide-y divide-gray-800">
                  {sectionItems.map((item) => (
                    <div key={item.id} className={`px-5 py-3 ${!item.isActive ? "opacity-50" : ""}`}>
                      {editingId === item.id ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <input
                              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                              value={editData.label ?? item.label}
                              onChange={(e) => setEditData((d) => ({ ...d, label: e.target.value }))}
                              placeholder="লেবেল"
                            />
                            <input
                              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                              value={editData.href ?? item.href}
                              onChange={(e) => setEditData((d) => ({ ...d, href: e.target.value }))}
                              placeholder="URL (যেমন: /about)"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-sm text-gray-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editData.openInNewTab ?? item.openInNewTab}
                                onChange={(e) => setEditData((d) => ({ ...d, openInNewTab: e.target.checked }))}
                                className="accent-cyan-500"
                              />
                              নতুন ট্যাবে খুলুন
                            </label>
                            <div className="flex gap-2 ml-auto">
                              <button onClick={() => { setEditingId(null); setEditData({}); }} className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded transition-colors">বাতিল</button>
                              <button
                                onClick={() => handleEditSave(item.id)}
                                disabled={saving === item.id}
                                className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-3 py-1.5 rounded transition-colors"
                              >
                                <Save className="w-3.5 h-3.5" />
                                {saving === item.id ? "সেভ হচ্ছে..." : "সেভ"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-0.5">
                            <button onClick={() => handleMoveUp(item, sectionItems)} className="text-gray-600 hover:text-gray-400 transition-colors" title="উপরে সরান">
                              <GripVertical className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-white text-sm font-medium">{item.label}</span>
                            <span className="ml-2 text-gray-500 text-xs">{item.href}</span>
                            {item.openInNewTab && <ExternalLink className="w-3 h-3 inline ml-1 text-gray-500" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleToggleActive(item)} title={item.isActive ? "লুকান" : "দেখান"} className="text-gray-500 hover:text-cyan-400 transition-colors">
                              {item.isActive ? <ToggleRight className="w-5 h-5 text-cyan-400" /> : <ToggleLeft className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => { setEditingId(item.id); setEditData({ label: item.label, href: item.href, openInNewTab: item.openInNewTab }); }}
                              className="text-gray-400 hover:text-cyan-400 text-xs px-2 py-1 rounded border border-gray-700 hover:border-cyan-500 transition-colors"
                            >
                              সম্পাদনা
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {addingSection === section && (
                    <div className="px-5 py-4 bg-gray-800/50">
                      <p className="text-xs text-cyan-400 font-medium mb-3">নতুন লিংক যোগ করুন</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input
                            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                            value={newItem.label}
                            onChange={(e) => setNewItem((n) => ({ ...n, label: e.target.value }))}
                            placeholder="লেবেল (যেমন: আমাদের সম্পর্কে)"
                            autoFocus
                          />
                          <input
                            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                            value={newItem.href}
                            onChange={(e) => setNewItem((n) => ({ ...n, href: e.target.value }))}
                            placeholder="URL (যেমন: /about অথবা https://...)"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-sm text-gray-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newItem.openInNewTab}
                              onChange={(e) => setNewItem((n) => ({ ...n, openInNewTab: e.target.checked }))}
                              className="accent-cyan-500"
                            />
                            নতুন ট্যাবে খুলুন
                          </label>
                          <div className="flex gap-2 ml-auto">
                            <button onClick={() => setAddingSection(null)} className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded transition-colors">বাতিল</button>
                            <button
                              onClick={() => handleAdd(section)}
                              disabled={saving === -1}
                              className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-3 py-1.5 rounded transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              {saving === -1 ? "যোগ হচ্ছে..." : "যোগ করুন"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}

export default function NavManagerPage() {
  return (
    <AdminGuard>
      <NavManagerContent />
    </AdminGuard>
  );
}
