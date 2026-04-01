import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-black/10">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter font-display">AIToolScout</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
              The world's most comprehensive AI tool directory. We help you find the best AI solutions for your business and creative needs.
            </p>
          </div>
          
          <div>
            <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-gray-400 mb-8">Directory</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-gray-500">
              <li><Link to="/categories" className="hover:text-blue-600 transition-colors">All Categories</Link></li>
              <li><Link to="/best/writing" className="hover:text-blue-600 transition-colors">Writing Tools</Link></li>
              <li><Link to="/best/image" className="hover:text-blue-600 transition-colors">Image Generators</Link></li>
              <li><Link to="/best/marketing" className="hover:text-blue-600 transition-colors">Marketing AI</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-gray-400 mb-8">Platform</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-gray-500">
              <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Blog & News</Link></li>
              <li><Link to="/submit" className="hover:text-blue-600 transition-colors">Submit a Tool</Link></li>
              <li><Link to="/advertise" className="hover:text-blue-600 transition-colors">Advertise</Link></li>
              <li><Link to="/admin/login" className="hover:text-blue-600 transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
            © 2024 AIToolScout. Built for the AI age.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] hover:text-black transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] hover:text-black transition-colors">Terms</Link>
            <Link to="/cookies" className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] hover:text-black transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
