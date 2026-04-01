import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getSearchGrounding } from "@/src/services/geminiService";
import { cn } from "@/src/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showAiBox, setShowAiBox] = useState(false);

  const handleAiSearch = async () => {
    if (!query.trim()) return;
    setIsAiLoading(true);
    setShowAiBox(true);
    const result = await getSearchGrounding(query);
    setAiSuggestion(result);
    setIsAiLoading(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center group">
        <div className="absolute left-4 text-gray-400 group-focus-within:text-black transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Search for AI tools (e.g. 'best writing assistant')"
          className="w-full pl-12 pr-24 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-lg"
        />
        <button
          onClick={handleAiSearch}
          disabled={isAiLoading || !query}
          className="absolute right-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isAiLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          AI Search
        </button>
      </div>

      <AnimatePresence>
        {showAiBox && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-4 p-6 bg-black text-white rounded-3xl shadow-2xl z-40"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 block mb-0.5">AI Analysis</span>
                  <span className="text-lg font-bold tracking-tight">AIToolScout Insights</span>
                </div>
              </div>
              <button onClick={() => setShowAiBox(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {isAiLoading ? (
              <div className="flex flex-col items-center py-12 gap-4">
                <div className="relative">
                  <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
                  <div className="absolute inset-0 blur-lg bg-purple-400/20 animate-pulse" />
                </div>
                <p className="text-gray-400 font-medium animate-pulse">Scanning the AI landscape...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-lg font-medium">
                  {aiSuggestion || "No specific insights found for this query."}
                </div>
                
                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <span>Powered by Gemini 3.1 Flash</span>
                  <span className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                    Real-time Data
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
