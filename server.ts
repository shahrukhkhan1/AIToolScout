import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in your .env file for local development.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Simple In-Memory Cache for Production
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware for caching
  const cacheMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return res.json(cached.data);
    }
    next();
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Newsletter Subscription (Mock Integration)
  app.post("/api/newsletter/subscribe", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    console.log(`[Newsletter] New subscriber: ${email}`);
    
    // Mock call to Resend/Mailchimp
    // await resend.emails.send({ ... });

    res.json({ success: true, message: "Subscribed successfully!" });
  });

  // Affiliate Redirect & Tracking
  app.get("/go/:slug", (req, res) => {
    const { slug } = req.params;
    const referrer = req.get("Referrer") || "direct";
    const userAgent = req.get("User-Agent");

    // In production, insert into affiliate_clicks table
    console.log(`[Affiliate Click] Slug: ${slug}, Referrer: ${referrer}`);
    
    // Mock redirect URL (in real app, fetch from DB)
    const redirectUrl = `https://example.com/ref/${slug}`;
    res.redirect(redirectUrl);
  });

  // AI Metadata Scraper
  app.post("/api/admin/scrape", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract metadata for this AI tool URL: ${url}. Return JSON with: name, description (150 chars), category, pricing (Free, Freemium, Paid), tags (array).`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const metadata = JSON.parse(response.text);
      res.json({ success: true, metadata });
    } catch (error) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: "Failed to scrape metadata" });
    }
  });

  // Bulk CSV Import
  app.post("/api/admin/import", (req, res) => {
    const { data } = req.body; // Expecting array of objects
    if (!Array.isArray(data)) return res.status(400).json({ error: "Invalid data format" });

    console.log(`[Import] Processing ${data.length} tools...`);
    // In production, perform bulk insert into tools table with duplicate detection
    res.json({ success: true, imported: data.length });
  });

  // Submission API
  app.post("/api/submit", (req, res) => {
    const submission = req.body;
    console.log("New tool submission:", submission);
    
    // MOCK NOTIFICATION: In production, send an email to admin
    console.log(`[NOTIFICATION] New tool submitted: ${submission.name}. Check admin dashboard to approve.`);
    
    res.json({ success: true, message: "Tool submitted for review!" });
  });

  // SEO: Dynamic Sitemap
  app.get("/sitemap.xml", (req, res) => {
    res.set("Content-Type", "application/xml");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${process.env.APP_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${process.env.APP_URL}/new-ai-tools</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${process.env.APP_URL}/blog</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>${process.env.APP_URL}/categories</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>
</urlset>`;
    res.send(sitemap);
  });

  // SEO: Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Sitemap: ${process.env.APP_URL}/sitemap.xml`);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aura AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
