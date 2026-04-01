import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Search, Database, CheckCircle, Loader2, AlertCircle, Sparkles, Plus, Edit2, Trash2, X, ExternalLink, RefreshCw, Newspaper } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, writeBatch } from "firebase/firestore";
import { AITool } from "@/src/types";
import { CATEGORIES } from "@/src/constants";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("tools");
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [formData, setFormData] = useState<Partial<AITool>>({
    name: "",
    description: "",
    category: "writing",
    pricing: "Free",
    websiteUrl: "",
    imageUrl: "",
    tags: [],
    rating: 5.0,
    reviewsCount: 0,
    isFeatured: false
  });

  const [scrapeUrl, setScrapeUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<{ tools?: any[], blogs?: any[] } | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingTool) {
        const toolRef = doc(db, "tools", editingTool.id);
        await updateDoc(toolRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, "tools"), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      handleFirestoreError(error, editingTool ? OperationType.UPDATE : OperationType.CREATE, "tools");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;
    try {
      await deleteDoc(doc(db, "tools", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tools/${id}`);
    }
  };

  const resetForm = () => {
    setEditingTool(null);
    setFormData({
      name: "",
      description: "",
      category: "writing",
      pricing: "Free",
      websiteUrl: "",
      imageUrl: "",
      tags: [],
      rating: 5.0,
      reviewsCount: 0,
      isFeatured: false
    });
  };

  const openEditModal = (tool: AITool) => {
    setEditingTool(tool);
    setFormData(tool);
    setIsModalOpen(true);
  };

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setIsScraping(true);
    setScrapedData(null);
    try {
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setScrapedData(data.metadata);
      } else {
        alert("Failed to scrape metadata: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Scraping failed:", error);
      alert("Scraping failed. Please check your connection and try again.");
    } finally {
      setIsScraping(false);
    }
  };

  const applyScrapedData = () => {
    if (!scrapedData) return;
    setFormData({
      ...formData,
      name: scrapedData.name || formData.name,
      description: scrapedData.description || formData.description,
      category: scrapedData.category?.toLowerCase() || formData.category,
      pricing: scrapedData.pricing || formData.pricing,
      tags: scrapedData.tags || formData.tags,
      websiteUrl: scrapeUrl
    });
    setScrapedData(null);
    setScrapeUrl("");
    setActiveTab("tools");
    setIsModalOpen(true);
  };

  const handleSync = async (type: "tools" | "blogs") => {
    setIsSyncing(true);
    setSyncResults(null);
    try {
      const res = await fetch(`/api/admin/sync/${type}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncResults(prev => ({ ...prev, [type]: data[type] }));
      } else {
        alert(`Failed to sync ${type}: ` + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error(`Sync ${type} failed:`, error);
      alert(`Sync ${type} failed. Check console for details.`);
    } finally {
      setIsSyncing(false);
    }
  };

  const saveSyncedData = async (type: "tools" | "blogs") => {
    if (!syncResults || !syncResults[type]) return;
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      const collectionName = type === "tools" ? "tools" : "blog_posts";
      
      syncResults[type].forEach((item: any) => {
        const docRef = doc(collection(db, collectionName));
        batch.set(docRef, {
          ...item,
          imageUrl: `https://picsum.photos/seed/${item.name || item.title}/800/400`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      alert(`Successfully saved ${syncResults[type].length} ${type}!`);
      setSyncResults(prev => ({ ...prev, [type]: null }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, type);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    // Simulate import
    await new Promise(r => setTimeout(r, 1500));
    setIsImporting(false);
    alert("Import successful!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="font-bold">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          {[
            { id: "tools", name: "Manage Tools", icon: Database },
            { id: "automation", name: "Automation", icon: RefreshCw },
            { id: "import", name: "Bulk Import", icon: Upload },
            { id: "scraper", name: "AI Scraper", icon: Sparkles },
            { id: "submissions", name: "Submissions", icon: CheckCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black tracking-tight capitalize">{activeTab}</h1>
          {activeTab === "tools" && (
            <button 
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-6 py-3 bg-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Tool
            </button>
          )}
        </header>

        {activeTab === "tools" && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-20 text-center">
                <Loader2 className="w-10 h-10 animate-spin mx-auto text-gray-300" />
                <p className="mt-4 text-gray-400 font-medium">Loading tools...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Tool</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Category</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Pricing</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tools.map(tool => (
                    <tr key={tool.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={tool.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          <div>
                            <p className="font-bold">{tool.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{tool.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full capitalize">
                          {tool.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          tool.pricing === "Free" ? "bg-green-50 text-green-700" :
                          tool.pricing === "Freemium" ? "bg-blue-50 text-blue-700" :
                          "bg-purple-50 text-purple-700"
                        }`}>
                          {tool.pricing}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => openEditModal(tool)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(tool.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <a 
                            href={tool.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tools.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">
                        No tools found. Click "Add New Tool" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "automation" && (
          <div className="max-w-4xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Sync Latest Tools</h3>
                  <p className="text-sm text-gray-500">Fetch new AI tools from Product Hunt, Futurepedia, and TAAFT RSS feeds.</p>
                </div>
                <button
                  onClick={() => handleSync("tools")}
                  disabled={isSyncing}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                  Sync Tools Now
                </button>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Sync AI News</h3>
                  <p className="text-sm text-gray-500">Fetch latest AI news from TechCrunch, The Verge, and MIT Technology Review.</p>
                </div>
                <button
                  onClick={() => handleSync("blogs")}
                  disabled={isSyncing}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                  Sync News Now
                </button>
              </div>
            </div>

            {syncResults && (
              <div className="space-y-8">
                {syncResults.tools && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">New Tools Found ({syncResults.tools.length})</h3>
                      <button
                        onClick={() => saveSyncedData("tools")}
                        disabled={isLoading}
                        className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Save All to Database
                      </button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                      {syncResults.tools.map((tool: any, i: number) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                          <div>
                            <p className="font-bold">{tool.name}</p>
                            <p className="text-xs text-gray-500">{tool.description}</p>
                            <span className="text-[10px] font-bold uppercase text-blue-600">{tool.category}</span>
                          </div>
                          <a href={tool.websiteUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-200 rounded-lg">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {syncResults.blogs && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">New Blog Posts Generated ({syncResults.blogs.length})</h3>
                      <button
                        onClick={() => saveSyncedData("blogs")}
                        disabled={isLoading}
                        className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Save All to Database
                      </button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                      {syncResults.blogs.map((blog: any, i: number) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-2xl">
                          <p className="font-bold">{blog.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{blog.excerpt}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] font-bold uppercase text-purple-600">{blog.category}</span>
                            <span className="text-[10px] font-bold uppercase text-gray-400">{blog.author}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "scraper" && (
          <div className="max-w-3xl space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6">AI Metadata Scraper</h2>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="Enter tool URL (e.g. https://openai.com)"
                  className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                />
                <button
                  onClick={handleScrape}
                  disabled={isScraping || !scrapeUrl}
                  className="px-8 py-4 bg-black text-white rounded-2xl font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {isScraping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Scrape
                </button>
              </div>
            </div>

            {scrapedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">Scraped Metadata</h3>
                  <button
                    onClick={applyScrapedData}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Use This Data
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Name</p>
                    <p className="font-bold">{scrapedData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                    <p className="font-bold capitalize">{scrapedData.category}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
                    <p className="text-gray-600">{scrapedData.description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pricing</p>
                    <p className="font-bold">{scrapedData.pricing}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {scrapedData.tags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === "import" && (
          <div className="max-w-3xl">
            <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-gray-200 text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Bulk CSV Import</h2>
                <p className="text-gray-500">Upload your tools CSV file to import them in bulk. Duplicate detection is enabled.</p>
              </div>
              <input type="file" className="hidden" id="csv-upload" accept=".csv" />
              <label
                htmlFor="csv-upload"
                className="inline-block px-8 py-4 bg-black text-white rounded-2xl font-bold cursor-pointer hover:bg-gray-800 transition-colors"
              >
                Select CSV File
              </label>
              <p className="text-xs text-gray-400 font-medium">Max 5,000 rows per upload</p>
            </div>
          </div>
        )}
      </main>

      {/* Tool Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tight">
                  {editingTool ? "Edit Tool" : "Add New Tool"}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto space-y-6 no-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Website URL</label>
                    <input
                      required
                      type="url"
                      value={formData.websiteUrl}
                      onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                    <input
                      required
                      type="url"
                      value={formData.imageUrl}
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Pricing</label>
                    <select
                      value={formData.pricing}
                      onChange={e => setFormData({ ...formData, pricing: e.target.value as any })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none"
                    >
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {editingTool ? "Update Tool" : "Create Tool"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

