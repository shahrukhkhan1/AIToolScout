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
      className="group relative bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300"
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
          <img
            src={tool.imageUrl}
            alt={tool.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <Link to={`/tool/${tool.id}`} className="block">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-black truncate">
                {tool.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 text-xs font-bold">
              <Star className="w-3 h-3 fill-yellow-700" />
              {tool.rating}
            </div>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded",
          tool.pricing === "Free" ? "bg-green-50 text-green-700" : 
          tool.pricing === "Freemium" ? "bg-blue-50 text-blue-700" : 
          "bg-purple-50 text-purple-700"
        )}>
          {tool.pricing}
        </span>
        
        <div className="flex items-center gap-3">
          <Link
            to={`/tool/${tool.id}`}
            className="text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1"
          >
            Details <ArrowUpRight className="w-3 h-3" />
          </Link>
          <a
            href={`/go/${tool.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-50 text-gray-900 rounded-lg hover:bg-black hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
