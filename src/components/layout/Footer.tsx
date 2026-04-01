import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-black tracking-tight">AIToolScout</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              The world's most comprehensive AI tool directory. We help you find the best AI solutions for your business and creative needs.
            </p>
          </div>
          
          <div>
            <h4 className="font-black uppercase text-xs tracking-widest text-gray-400 mb-6">Directory</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link to="/categories" className="hover:text-black transition-colors">All Categories</Link></li>
              <li><Link to="/best-ai-tools-for-writing" className="hover:text-black transition-colors">Writing Tools</Link></li>
              <li><Link to="/best-ai-tools-for-image" className="hover:text-black transition-colors">Image Generators</Link></li>
              <li><Link to="/best-ai-tools-for-marketing" className="hover:text-black transition-colors">Marketing AI</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-xs tracking-widest text-gray-400 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link to="/blog" className="hover:text-black transition-colors">Blog & News</Link></li>
              <li><Link to="/submit" className="hover:text-black transition-colors">Submit a Tool</Link></li>
              <li><Link to="/advertise" className="hover:text-black transition-colors">Advertise</Link></li>
              <li><Link to="/admin/login" className="hover:text-black transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            © 2024 AIToolScout. Built for the AI age.
          </p>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-black transition-colors">Cookies</Link></li>
            </ul>
        </div>
      </div>
    </footer>
  );
}
