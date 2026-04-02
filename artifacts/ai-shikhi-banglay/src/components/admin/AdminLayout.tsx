import { useAdmin } from "@/hooks/useAdmin";
import { useLocation } from "wouter";
import {
  BookOpen,
  LogOut,
  Eye,
  LayoutDashboard,
  PenSquare,
  Plus,
  Layout,
  Navigation,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mail,
  Share2,
  Wrench,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "ড্যাশবোর্ড", href: "/admin", exact: true },
  { icon: <PenSquare className="w-5 h-5" />, label: "সব পোস্ট", href: "/admin", exact: true },
  { icon: <Plus className="w-5 h-5" />, label: "নতুন পোস্ট", href: "/admin/posts/new" },
  { icon: <Layout className="w-5 h-5" />, label: "পেজ ম্যানেজার", href: "/admin/pages" },
  { icon: <Navigation className="w-5 h-5" />, label: "নেভিগেশন ম্যানেজার", href: "/admin/nav" },
  { icon: <Wrench className="w-5 h-5" />, label: "AI টুলস", href: "/admin/tools" },
  { icon: <Settings className="w-5 h-5" />, label: "সাইট সেটিংস", href: "/admin/settings" },
  { icon: <Share2 className="w-5 h-5" />, label: "সোশ্যাল লিঙ্ক", href: "/admin/social-links" },
  { icon: <Mail className="w-5 h-5" />, label: "সাবস্ক্রাইবার", href: "/admin/subscribers" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { username, logout } = useAdmin();
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  const isActive = (item: NavItem) => {
    if (item.exact) return location === item.href;
    return location.startsWith(item.href);
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-gray-900 border-r border-gray-800 fixed top-0 left-0 h-full z-20 transition-all duration-200 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800 min-h-[60px]">
          <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">AI শিখি বাংলায়</p>
              <p className="text-gray-500 text-xs truncate">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.href + item.label}
                onClick={() => setLocation(item.href)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400 border-r-2 border-cyan-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 py-3">
          <a
            href="/"
            target="_blank"
            title={collapsed ? "সাইট দেখুন" : undefined}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-cyan-400 hover:bg-gray-800 transition-colors"
          >
            <Eye className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>সাইট দেখুন</span>}
          </a>
          {!collapsed && (
            <div className="px-4 py-2 text-xs text-gray-600 truncate">{username}</div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? "লগআউট" : undefined}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>লগআউট</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-16 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-200 ${collapsed ? "ml-16" : "ml-60"}`}>
        {title && (
          <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 sticky top-0 z-10">
            <h1 className="text-white font-semibold text-base">{title}</h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
