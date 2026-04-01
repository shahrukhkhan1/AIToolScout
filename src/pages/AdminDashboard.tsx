import { useState } from "react";
import { motion } from "motion/react";
import { Upload, Search, Database, CheckCircle, Loader2, AlertCircle, Sparkles, Plus } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("tools");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setIsScraping(true);
    try {
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl }),
      });
      const data = await res.json();
      setScrapedData(data.metadata);
    } catch (error) {
      console.error("Scraping failed:", error);
    } finally {
      setIsScraping(false);
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
          <button className="px-6 py-3 bg-black text-white rounded-xl font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Tool
          </button>
        </header>

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
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Preview Metadata</h3>
                  <button onClick={handleImport} className="px-6 py-2 bg-green-500 text-white rounded-xl font-bold text-sm">
                    Save to Database
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                    <input defaultValue={scrapedData.name} className="w-full px-4 py-3 bg-gray-50 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Pricing</label>
                    <input defaultValue={scrapedData.pricing} className="w-full px-4 py-3 bg-gray-50 rounded-xl" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                    <textarea defaultValue={scrapedData.description} className="w-full px-4 py-3 bg-gray-50 rounded-xl" rows={3} />
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

        {activeTab === "tools" && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Tool</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Category</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3].map(i => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold">ChatGPT</td>
                    <td className="px-8 py-6 text-gray-500">Writing</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">Active</span>
                    </td>
                    <td className="px-8 py-6">
                      <button className="text-sm font-bold text-blue-600 hover:underline mr-4">Edit</button>
                      <button className="text-sm font-bold text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
