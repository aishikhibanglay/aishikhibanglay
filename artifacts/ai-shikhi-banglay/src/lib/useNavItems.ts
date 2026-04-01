import { useState, useEffect } from "react";

export interface NavItem {
  id: number;
  label: string;
  href: string;
  section: "navbar" | "footer_main" | "footer_legal";
  position: number;
  isActive: boolean;
  openInNewTab: boolean;
}

let cachedNavItems: NavItem[] | null = null;
let fetchPromise: Promise<NavItem[]> | null = null;

async function fetchNavItems(): Promise<NavItem[]> {
  if (cachedNavItems) return cachedNavItems;
  if (!fetchPromise) {
    fetchPromise = fetch("/api/nav-items")
      .then((r) => r.json())
      .then((data: NavItem[]) => {
        cachedNavItems = data;
        return data;
      })
      .catch(() => []);
  }
  return fetchPromise;
}

export function useNavItems() {
  const [navItems, setNavItems] = useState<NavItem[]>(Array.isArray(cachedNavItems) ? cachedNavItems : []);
  const [loading, setLoading] = useState(!cachedNavItems);

  useEffect(() => {
    if (cachedNavItems) {
      setNavItems(Array.isArray(cachedNavItems) ? cachedNavItems : []);
      setLoading(false);
      return;
    }
    fetchNavItems().then((items) => {
      setNavItems(Array.isArray(items) ? items : []);
      setLoading(false);
    });
  }, []);

  const bySection = (section: NavItem["section"]) => {
    const safeItems = Array.isArray(navItems) ? navItems : [];
    return safeItems.filter((item) => item.section === section).sort((a, b) => a.position - b.position);
  };

  return { navItems: Array.isArray(navItems) ? navItems : [], loading, bySection };
}

export function invalidateNavItemsCache() {
  cachedNavItems = null;
  fetchPromise = null;
}
