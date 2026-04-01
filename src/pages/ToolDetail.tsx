import { useParams, Link } from "react-router-dom";
import { TOOLS } from "@/src/constants";
import { Star, ExternalLink, ArrowLeft, CheckCircle, ShieldCheck, Globe, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function ToolDetail() {
  const { id } = useParams();
  const tool = TOOLS.find((t) => t.id === id);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tool not found</h2>
          <Link to="/" className="text-black underline">Back to directory</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
                <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black tracking-tight">{tool.name}</h1>
                  {tool.isFeatured && (
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase rounded border border-yellow-100">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    {tool.rating} ({tool.reviewsCount} reviews)
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {new URL(tool.url).hostname}
                  </div>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {tool.name}</h2>
              <p>{tool.description}</p>
              <p>
                {tool.name} is a powerful tool designed for {tool.category} professionals. 
                It offers a wide range of features aimed at improving efficiency and output quality.
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Key Features</h3>
              <ul className="space-y-3 list-none p-0">
                {["Advanced AI processing", "Intuitive user interface", "Cloud-based synchronization", "API access for developers"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold mb-6">User Reviews</h3>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                      </div>
                      <span className="text-xs font-bold text-gray-400">Verified User</span>
                    </div>
                    <p className="text-gray-600 text-sm italic">
                      "This tool has completely changed my workflow. The AI suggestions are incredibly accurate and save me hours every week."
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            <div className="bg-black text-white p-8 rounded-[2.5rem] sticky top-24">
              <div className="mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing</span>
                <div className="text-3xl font-black mt-1">{tool.pricing}</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  Verified Official Link
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Instant Access
                </div>
              </div>

              <a
                href={`/go/${tool.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                Visit Website <ExternalLink className="w-4 h-4" />
              </a>
              
              <p className="text-[10px] text-center text-gray-500 mt-4 font-medium uppercase tracking-wider">
                Affiliate link - supports our directory
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem]">
              <h4 className="font-bold mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {tool.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <h4 className="font-bold mb-4">Compare with</h4>
              <div className="space-y-3">
                {TOOLS.filter(t => t.id !== tool.id && t.category === tool.category).slice(0, 3).map(other => (
                  <Link 
                    key={other.id} 
                    to={`/compare/${tool.id}-vs-${other.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <img src={other.imageUrl} alt={other.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-sm font-bold">{tool.name} vs {other.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
