import { useAdmin } from "@/hooks/useAdmin";
import { useLocation } from "wouter";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { username, loading } = useAdmin();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !username) {
      setLocation("/admin/login");
    }
  }, [loading, username, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-cyan-400 text-lg">লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!username) return null;

  return <>{children}</>;
}
