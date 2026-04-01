import { Link } from "react-router-dom";
import { Search, Home, ArrowLeft } from "lucide-react";
import SEO from "@/src/components/seo/SEO";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <SEO 
        title="404 - Page Not Found | AIToolScout"
        description="The page you are looking for does not exist. Explore our AI tool directory to find what you need."
      />
      
      <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-gray-100">
        <Search className="w-10 h-10 text-gray-300" />
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Oops! Page not found.</h2>
      <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
        The page you're looking for might have been moved, deleted, or never existed in the first place.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/" 
          className="px-8 py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
        >
          <Home className="w-5 h-5" /> Back to Home
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="px-8 py-4 bg-gray-100 text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
        >
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
      </div>
      
      <div className="mt-20 pt-10 border-t border-gray-100 w-full max-w-lg">
        <p className="text-sm text-gray-400 font-medium mb-4 uppercase tracking-widest">Popular Categories</p>
        <div className="flex flex-wrap justify-center gap-3">
          {["Writing", "Design", "Video", "Coding"].map(cat => (
            <Link 
              key={cat} 
              to={`/best/${cat.toLowerCase()}`}
              className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
