import { useState, useEffect, useCallback } from "react";

export interface CommunityMember {
  id: number;
  username: string;
  email: string;
  isModerator: boolean;
  warningCount: number;
  joinedAt: string;
}

const TOKEN_KEY = "community_token";
const MEMBER_KEY = "community_member";

function getStoredToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function getStoredMember(): CommunityMember | null {
  try {
    const s = localStorage.getItem(MEMBER_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function communityHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { "x-community-token": token, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export function useCommunityAuth() {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [member, setMember] = useState<CommunityMember | null>(getStoredMember);
  const [loading, setLoading] = useState(false);

  const saveSession = useCallback((t: string, m: CommunityMember) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(MEMBER_KEY, JSON.stringify(m));
    setToken(t);
    setMember(m);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await fetch("/api/community/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "নিবন্ধন ব্যর্থ হয়েছে");
    saveSession(data.token, data.member);
    return data.member as CommunityMember;
  }, [saveSession]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/community/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "লগইন ব্যর্থ হয়েছে");
    saveSession(data.token, data.member);
    return data.member as CommunityMember;
  }, [saveSession]);

  const logout = useCallback(async () => {
    const t = getStoredToken();
    if (t) {
      fetch("/api/community/auth/logout", { method: "POST", headers: { "x-community-token": t, "Content-Type": "application/json" } }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MEMBER_KEY);
    setToken(null);
    setMember(null);
  }, []);

  // Verify token on mount
  useEffect(() => {
    const t = getStoredToken();
    if (!t) { setLoading(false); return; }
    setLoading(true);
    fetch("/api/community/auth/me", { headers: { "x-community-token": t } })
      .then((r) => r.ok ? r.json() : null)
      .then((m) => {
        if (m) { saveSession(t, m); }
        else { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(MEMBER_KEY); setToken(null); setMember(null); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [saveSession]);

  return { token, member, loading, register, login, logout, isLoggedIn: !!member };
}
