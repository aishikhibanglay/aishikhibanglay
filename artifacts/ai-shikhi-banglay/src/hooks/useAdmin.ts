import { useState, useEffect, createContext, useContext } from "react";
import { api } from "@/lib/api";

interface AdminContextValue {
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AdminContext = createContext<AdminContextValue>({
  username: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function useAdminState(): AdminContextValue {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then((data) => setUsername(data.username))
      .catch(() => setUsername(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (user: string, pass: string) => {
    const data = await api.login(user, pass);
    setUsername(data.username);
  };

  const logout = async () => {
    await api.logout();
    setUsername(null);
  };

  return { username, loading, login, logout };
}
