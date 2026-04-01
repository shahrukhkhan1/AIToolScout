import { Link, NavLink } from "react-router-dom";
import { Search, PlusCircle, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Directory", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-black/10">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter font-display">AIToolScout</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "text-xs font-black uppercase tracking-widest transition-all hover:text-blue-600",
                    isActive ? "text-blue-600" : "text-gray-400"
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/submit"
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/5 hover:shadow-blue-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Tool
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-lg font-medium text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/submit"
                className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                <PlusCircle className="w-5 h-5" />
                Submit Tool
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
