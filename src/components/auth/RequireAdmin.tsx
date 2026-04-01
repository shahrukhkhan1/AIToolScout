import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert, Loader2 } from "lucide-react";

// This is a mock implementation. In production, use Supabase Auth.
// const { data: { user } } = await supabase.auth.getUser();
// const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulate Auth Check
    const checkAuth = async () => {
      await new Promise(r => setTimeout(r, 1000));
      // For demo purposes, we'll allow access if a specific localStorage key exists
      // In production, this MUST be a real server-side check
      const mockAdmin = localStorage.getItem("aitoolscout_admin") === "true";
      setIsAdmin(mockAdmin);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Verifying Credentials</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center p-12 bg-white rounded-[3rem] shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            You do not have the required permissions to access the admin dashboard.
          </p>
          <Navigate to="/" state={{ from: location }} replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
