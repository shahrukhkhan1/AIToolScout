import { Link } from "react-router-dom";
import { CATEGORIES, TOOLS } from "@/src/constants";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import ToolCard from "@/src/components/ui/ToolCard";
import SEO from "@/src/components/seo/SEO";

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="AI Tool Categories" 
        description="Explore AI tools by category. Find the best AI writing, image generation, coding, and marketing tools."
      />
      
      <section className="pt-20 pb-16 px-4 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Explore AI by <span className="text-blue-600">Category</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Browse our curated collections of AI tools organized by use case and industry.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {CATEGORIES.map((category) => {
            const categoryTools = TOOLS.filter(t => t.category === category.id).slice(0, 3);
            
            return (
              <motion.div 
                key={category.id}
                whileHover={{ y: -4 }}
                className="bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {TOOLS.filter(t => t.category === category.id).length} Tools
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold mb-3">{category.name}</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  {category.description}
                </p>

                <div className="space-y-4 mb-8">
                  {categoryTools.map(tool => (
                    <Link 
                      key={tool.id} 
                      to={`/tool/${tool.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                      <img src={tool.imageUrl} alt={tool.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-sm font-bold">{tool.name}</span>
                    </Link>
                  ))}
                </div>

                <Link 
                  to={`/best/${category.id}`}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 text-black rounded-2xl font-bold hover:bg-black hover:text-white transition-all"
                >
                  View All {category.name} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
