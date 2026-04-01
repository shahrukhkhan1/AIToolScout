import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BLOG_POSTS } from "@/src/constants";
import { motion } from "motion/react";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import SEO from "@/src/components/seo/SEO";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setIsLoading(false);
    }, (error) => {
      // Fallback to static posts if collection doesn't exist or error occurs
      console.warn("Falling back to static blog posts:", error);
      setPosts(BLOG_POSTS);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="AI Insights & Guides" 
        description="Stay updated with the latest AI trends, tool reviews, and productivity guides from the AIToolScout team."
      />

      <section className="pt-20 pb-16 px-4 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            AI Insights & <span className="text-purple-600">Guides</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Expert analysis, tool comparisons, and tutorials to help you master the AI revolution.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="py-32 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium">Loading insights...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts.map((post) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-6 bg-gray-100 relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      loading="lazy"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                  </div>

                  <h2 className="text-3xl font-black mb-4 group-hover:text-purple-600 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-black group-hover:gap-4 transition-all">
                    Read Full Article <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-purple-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Never miss an update.</h2>
          <p className="text-purple-100 mb-10 max-w-md mx-auto">
            Get our weekly digest of the best AI tools and industry news delivered straight to your inbox.
          </p>
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
                if (res.ok) alert("Successfully subscribed!");
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
              placeholder="your@email.com" 
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button type="submit" className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold hover:bg-purple-50 transition-colors">
              Join Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
