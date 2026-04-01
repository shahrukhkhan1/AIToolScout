import { useParams, Link } from "react-router-dom";
import { TOOLS, CATEGORIES } from "@/src/constants";
import ToolCard from "@/src/components/ui/ToolCard";
import SEO from "@/src/components/seo/SEO";
import { CheckCircle, HelpCircle, ArrowRight } from "lucide-react";

export default function ProgrammaticPage() {
  const { category: categoryId } = useParams();
  
  const category = CATEGORIES.find(c => c.id === categoryId?.toLowerCase());
  
  // Format audience name: replace hyphens with spaces and capitalize each word
  const audienceName = category ? category.name : (categoryId || "")
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  // Filter tools based on audience or category
  const filteredTools = TOOLS.filter(t => {
    const target = (categoryId || "").toLowerCase();
    const tCategoryId = t.category.toLowerCase();
    const tags = t.tags.map(tag => tag.toLowerCase());
    
    // Check if audience matches category ID exactly (e.g. /best/image)
    if (target === tCategoryId) return true;
    
    // Check if audience matches name (e.g. /best/writing)
    const categoryName = CATEGORIES.find(c => c.id === tCategoryId)?.name.toLowerCase() || "";
    if (target === categoryName) return true;

    const targetClean = target.replace(/-/g, " ");
    
    return tCategoryId.includes(targetClean) || 
           targetClean.includes(tCategoryId) ||
           tags.some(tag => tag.includes(targetClean)) ||
           tags.some(tag => targetClean.includes(tag));
  });

  const faqs = [
    { q: `What are the best AI tools for ${audienceName}?`, a: `The best AI tools for ${audienceName} include ChatGPT for writing, Midjourney for creative assets, and specialized coding assistants.` },
    { q: `Are there free AI tools for ${audienceName}?`, a: `Yes, many tools like ChatGPT and various open-source models offer free tiers for ${audienceName}.` }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`Best AI Tools for ${audienceName} (2024)`}
        description={`Discover the most powerful AI tools specifically curated for ${audienceName}. Boost your productivity with these top-rated solutions.`}
      />

      <section className="pt-20 pb-16 px-4 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Best AI Tools for <span className="text-blue-600">{audienceName}</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We've curated the ultimate list of AI-powered software to help {audienceName} work smarter, not harder.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] mb-20">
            <HelpCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">No specific tools found for "{audienceName}"</h2>
            <p className="text-gray-500 mb-8">But here are some of our most popular AI tools instead.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
              {TOOLS.slice(0, 3).map(tool => <ToolCard key={tool.id} tool={tool} />)}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Linking */}
        <div className="p-12 bg-black text-white rounded-[3rem] text-center">
          <h2 className="text-2xl font-bold mb-6">Explore More AI Categories</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Students", "Developers", "Marketers", "Designers"].map(item => (
              <Link 
                key={item} 
                to={`/best-ai-tools-for-${item.toLowerCase()}`}
                className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                AI for {item} <ArrowRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
