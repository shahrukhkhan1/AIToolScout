import { useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, Upload, CheckCircle, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/src/constants";

export default function Submit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vercel has a 4.5MB limit for the entire request body. 
      // Base64 encoding adds ~33% overhead, so we limit to 2MB to be safe.
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo file is too large. Please upload an image smaller than 2MB.");
        return;
      }
      setLogoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      website: formData.get("website"),
      category: formData.get("category"),
      description: formData.get("description"),
      logo: logo,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("A server error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black mb-4">Submission Received!</h2>
          <p className="text-gray-500 mb-8">
            Thank you for contributing to AIToolScout. Our team will review your submission and notify you via email once it's live.
          </p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="px-8 py-3 bg-black text-white rounded-2xl font-bold"
          >
            Submit another tool
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 tracking-tight">Submit a Tool</h1>
          <p className="text-gray-500 text-lg">
            Help us grow the most comprehensive AI directory on the web.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-gray-50/50 p-8 md:p-12 rounded-[3rem] border border-gray-100">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Tool Name</label>
            <input
              required
              name="name"
              type="text"
              placeholder="e.g. ChatGPT"
              className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Website URL</label>
            <input
              required
              name="website"
              type="url"
              placeholder="https://example.com"
              className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label>
            <select 
              name="category"
              className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
            <textarea
              required
              name="description"
              rows={4}
              placeholder="What does this tool do?"
              className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Upload Tool Logo</label>
            <label className="block p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center hover:border-black transition-colors cursor-pointer group relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {logo ? (
                <div className="flex items-center justify-center gap-4">
                  <img src={logo} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-black">{logoName}</p>
                    <p className="text-xs text-gray-400">Click to change</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:text-black transition-colors" />
                  <p className="text-sm font-bold text-gray-400 group-hover:text-black">Click to upload logo</p>
                  <p className="text-xs text-gray-300 mt-1">PNG, JPG up to 2MB</p>
                </>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <PlusCircle className="w-6 h-6" />
                Submit for Review
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-gray-400 font-medium">
            By submitting, you agree to our terms of service and privacy policy.
          </p>
        </form>
      </div>
    </div>
  );
}
