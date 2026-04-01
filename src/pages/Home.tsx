import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { TOOLS, CATEGORIES } from "@/src/constants";
import ToolCard from "@/src/components/ui/ToolCard";
import SearchBar from "@/src/components/ui/SearchBar";
import { Sparkles, TrendingUp, Zap, CheckCircle } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [subscribed, setSubscribed] = useState(false);

  const filteredTools = useMemo(() => {
    let result = TOOLS.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
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
  }, [searchQuery, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-500 mb-6"
          >
            <Sparkles className="w-3 h-3 text-black" />
            DISCOVER THE FUTURE OF PRODUCTIVITY
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Find the best <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">
              AI Tools
            </span> for your workflow.
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Aura AI is the most comprehensive directory of AI tools, curated by experts and powered by AI insights.
          </p>
          
          <SearchBar onSearch={setSearchQuery} />
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

        {filteredTools.length > 0 ? (
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
