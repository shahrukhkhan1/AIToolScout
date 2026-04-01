import { useState } from "react";
import { ShieldCheck, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, auth, db } from "@/src/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if user is the default admin or has admin role in Firestore
      const isAdmin = user.email === "shahrukh.khan1766@gmail.com";
      
      let hasAdminRole = false;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          hasAdminRole = true;
        }
      } catch (e) {
        console.log("Error checking user role, might not have a user doc yet.");
      }

      if (isAdmin || hasAdminRole) {
        localStorage.setItem("aitoolscout_admin", "true");
        navigate("/admin");
      } else {
        await auth.signOut();
        setError("Access denied. You do not have administrator privileges.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/10">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Admin Access</h1>
          <p className="text-gray-500 font-medium tracking-wide uppercase text-[10px]">Secure Portal</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-6">
          <p className="text-center text-gray-500 text-sm">
            Please sign in with your administrator account to access the dashboard.
          </p>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Sign in with Google
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        <p className="text-center mt-8 text-xs text-gray-400 font-medium">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
