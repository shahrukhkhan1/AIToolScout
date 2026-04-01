import { Star, ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { AITool } from "@/src/types";
import { cn } from "@/src/lib/utils";

interface ToolCardProps {
  tool: AITool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
          <img
            src={tool.imageUrl}
            alt={tool.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-50/50 px-2.5 py-1 rounded-full text-yellow-700 text-[10px] font-black uppercase tracking-wider border border-yellow-100/50">
          <Star className="w-3 h-3 fill-yellow-700" />
          {tool.rating}
        </div>
      </div>

      <div className="mb-6">
        <Link to={`/tool/${tool.id}`} className="block group/title">
          <h3 className="text-xl font-black text-gray-900 mb-2 flex items-center gap-2 group-hover/title:text-blue-600 transition-colors">
            {tool.name}
            <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-y-0 group-hover/title:translate-x-0 transition-all" />
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium">
          {tool.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] uppercase tracking-widest font-black text-gray-400 bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-100/50"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border",
            tool.pricing === "Free" ? "bg-green-50 text-green-700 border-green-100" : 
            tool.pricing === "Freemium" ? "bg-blue-50 text-blue-700 border-blue-100" : 
            "bg-purple-50 text-purple-700 border-purple-100"
          )}>
            {tool.pricing}
          </span>
        </div>
        
        <a
          href={`/go/${tool.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-2xl text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-black/5 hover:shadow-blue-600/20"
        >
          Visit <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
