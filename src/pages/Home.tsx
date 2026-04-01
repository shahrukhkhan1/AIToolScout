import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { CATEGORIES } from "@/src/constants";
import ToolCard from "@/src/components/ui/ToolCard";
import SearchBar from "@/src/components/ui/SearchBar";
import { Sparkles, TrendingUp, Zap, CheckCircle, Loader2 } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { AITool } from "@/src/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [subscribed, setSubscribed] = useState(false);
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "tools"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const toolsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AITool[];
      setTools(toolsData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "tools");
    });

    return () => unsubscribe();
  }, []);

  const filteredTools = useMemo(() => {
    let result = tools.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "top-rated") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "popular") {
      result = [...result].sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return result;
  }, [tools, searchQuery, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-50 rounded-full blur-[100px] opacity-50" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 mb-8 shadow-sm"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="tracking-widest uppercase">The Future of AI Discovery</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 mb-8 leading-[0.95]">
            Discover the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
              Next Generation
            </span> <br /> of AI Tools.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            AIToolScout is the definitive directory for the world's most powerful AI solutions. Curated by experts, powered by intelligence.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={setSearchQuery} />
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400 grayscale opacity-50">
            {/* Mock partner logos */}
            <span className="text-sm font-black tracking-widest uppercase">OpenAI</span>
            <span className="text-sm font-black tracking-widest uppercase">Anthropic</span>
            <span className="text-sm font-black tracking-widest uppercase">Google</span>
            <span className="text-sm font-black tracking-widest uppercase">Meta</span>
          </div>
        </div>
      </section>

      {/* Categories & Filter */}
      <section className="py-8 border-y border-gray-50 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-4">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex-shrink-0 ${
              activeCategory === "all" ? "bg-black text-white" : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            All Tools
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex-shrink-0 ${
                activeCategory === cat.id ? "bg-black text-white" : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900">
              {activeCategory === "all" ? "Trending Tools" : `${CATEGORIES.find(c => c.id === activeCategory)?.name} Tools`}
            </h2>
            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
              {filteredTools.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button 
              onClick={() => setSortBy("popular")}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                sortBy === "popular" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Popular
            </button>
            <button 
              onClick={() => setSortBy("newest")}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                sortBy === "newest" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Newest
            </button>
            <button 
              onClick={() => setSortBy("top-rated")}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                sortBy === "top-rated" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Top Rated
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-32 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium">Curating the best AI tools for you...</p>
          </div>
        ) : filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No tools found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
          </div>
        )}
      </main>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-black rounded-[2.5rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Get the best AI tools <br /> in your inbox.
          </h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">
            Join 50,000+ creators getting weekly updates on the latest AI breakthroughs.
          </p>
          
          {subscribed ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] inline-block"
            >
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
              <p className="text-gray-400">Check your inbox for the next update.</p>
            </motion.div>
          ) : (
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const email = (e.target as any).email.value;
                try {
                  const res = await fetch("/api/newsletter/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });
                  if (res.ok) setSubscribed(true);
                } catch (err) {
                  console.error(err);
                }
              }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button type="submit" className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
