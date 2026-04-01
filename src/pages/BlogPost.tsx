import { useParams, Link } from "react-router-dom";
import { BLOG_POSTS } from "@/src/constants";
import ReactMarkdown from "react-markdown";
import { Calendar, User, ArrowLeft, Share2, Bookmark } from "lucide-react";
import SEO from "@/src/components/seo/SEO";

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) return <div className="p-20 text-center font-bold">Post not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <SEO title={post.title} description={post.excerpt} />
      
      <article className="max-w-4xl mx-auto px-4 py-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
            <span className="text-purple-600">{post.category}</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {post.date}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {post.author}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
              <div>
                <p className="text-sm font-bold">{post.author}</p>
                <p className="text-xs text-gray-400 font-medium">AI Content Strategist</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Share2 className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Bookmark className="w-5 h-5" /></button>
            </div>
          </div>
        </header>

        <div className="aspect-[21/9] rounded-[3rem] overflow-hidden mb-12 bg-gray-100">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-purple-600">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <footer className="mt-20 pt-12 border-t border-gray-100">
          <h3 className="text-xl font-bold mb-6">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-500 text-sm font-bold rounded-xl">
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </div>
  );
}
