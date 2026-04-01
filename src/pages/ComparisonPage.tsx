import { useParams, Link } from "react-router-dom";
import { TOOLS } from "@/src/constants";
import { ArrowLeft, ArrowRight, Zap, CheckCircle, XCircle, Scale } from "lucide-react";
import SEO from "@/src/components/seo/SEO";

export default function ComparisonPage() {
  const { slug } = useParams();
  
  // Handle both -vs- and -and- separators
  const parts = slug?.includes("-vs-") ? slug.split("-vs-") : slug?.split("-and-");
  const t1Param = parts?.[0];
  const t2Param = parts?.[1];
  
  const tool1 = TOOLS.find(t => t.id === t1Param) || TOOLS[0];
  const tool2 = TOOLS.find(t => t.id === t2Param) || TOOLS[1];

  const features = [
    { name: "Pricing Model", t1: tool1.pricing, t2: tool2.pricing },
    { name: "User Rating", t1: `${tool1.rating}/5`, t2: `${tool2.rating}/5` },
    { name: "Total Reviews", t1: tool1.reviewsCount, t2: tool2.reviewsCount },
    { name: "Category", t1: tool1.category, t2: tool2.category },
    { name: "Featured Tool", t1: tool1.isFeatured ? "Yes" : "No", t2: tool2.isFeatured ? "Yes" : "No" },
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <SEO 
        title={`${tool1.name} vs ${tool2.name} Comparison | AIToolScout`}
        description={`Compare ${tool1.name} and ${tool2.name} side-by-side. See features, pricing, and ratings to find the best AI tool for your needs.`}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="p-3 bg-black text-white rounded-2xl">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Tool Comparison
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tool 1 Card */}
          <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white rounded-3xl mb-6 shadow-sm overflow-hidden border border-gray-100">
              <img src={tool1.imageUrl} alt={tool1.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-black mb-2">{tool1.name}</h2>
            <p className="text-gray-500 text-sm mb-8 line-clamp-2">{tool1.description}</p>
            <a href={`/go/${tool1.id}`} className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
              Visit {tool1.name} <Zap className="w-4 h-4" />
            </a>
          </div>

          {/* Comparison Table */}
          <div className="lg:col-span-1 flex flex-col justify-center">
            <div className="space-y-4">
              {features.map((f, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    {f.name}
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-center font-bold text-gray-900 border-r border-gray-100 pr-2">
                      {f.t1}
                    </div>
                    <div className="text-center font-bold text-gray-900 pl-2">
                      {f.t2}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tool 2 Card */}
          <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white rounded-3xl mb-6 shadow-sm overflow-hidden border border-gray-100">
              <img src={tool2.imageUrl} alt={tool2.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-black mb-2">{tool2.name}</h2>
            <p className="text-gray-500 text-sm mb-8 line-clamp-2">{tool2.description}</p>
            <a href={`/go/${tool2.id}`} className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
              Visit {tool2.name} <Zap className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8">Ready to explore more?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="px-8 py-4 bg-gray-100 text-black rounded-2xl font-bold hover:bg-gray-200 transition-all">
              Back to Directory
            </Link>
            <Link to="/categories" className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all">
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
