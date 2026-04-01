import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import Parser from "rss-parser";

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

export async function createServer() {
  const app = express();
  const PORT = 3000;
  const parser = new Parser();

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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

  // Data Automation: Sync Tools
  app.post("/api/admin/sync/tools", async (req, res) => {
    const feeds = [
      "https://www.futurepedia.io/rss.xml",
      "https://theresanaiforthat.com/rss/"
    ];

    const results = [];
    
    try {
      for (const url of feeds) {
        try {
          const feed = await parser.parseURL(url);
          results.push(...feed.items.map(item => ({
            name: item.title,
            description: item.contentSnippet || item.content,
            websiteUrl: item.link,
            source: url.includes("futurepedia") ? "Futurepedia" : "TAAFT",
            pubDate: item.pubDate
          })));
        } catch (e) {
          console.error(`Failed to fetch feed ${url}:`, e);
        }
      }

      // Optional: Product Hunt Sync (Requires Token)
      const phToken = process.env.PRODUCT_HUNT_TOKEN;
      if (phToken) {
        const query = `
          {
            posts(topic: "artificial-intelligence", first: 10) {
              edges {
                node {
                  name
                  tagline
                  url
                  createdAt
                }
              }
            }
          }
        `;
        const phRes = await fetch("https://api.producthunt.com/v2/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${phToken}`
          },
          body: JSON.stringify({ query })
        });
        const phData = await phRes.json();
        if (phData.data?.posts?.edges) {
          results.push(...phData.data.posts.edges.map((e: any) => ({
            name: e.node.name,
            description: e.node.tagline,
            websiteUrl: e.node.url,
            source: "Product Hunt",
            pubDate: e.node.createdAt
          })));
        }
      }

      // Use AI to process and deduplicate
      const ai = getAI();
      const processRes = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Process these raw AI tool entries. Deduplicate by name, categorize into (writing, image, video, code, marketing, productivity, audio, business), and return a clean JSON array of tools.
        Raw Data: ${JSON.stringify(results.slice(0, 20))}`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const processedTools = JSON.parse(processRes.text);
      res.json({ success: true, count: processedTools.length, tools: processedTools });
    } catch (error) {
      console.error("Sync tools error:", error);
      res.status(500).json({ error: "Failed to sync tools" });
    }
  });

  // Data Automation: Sync Blogs
  app.post("/api/admin/sync/blogs", async (req, res) => {
    const feeds = [
      "https://techcrunch.com/category/artificial-intelligence/feed/",
      "https://www.theverge.com/rss/ai/index.xml",
      "https://www.technologyreview.com/topic/artificial-intelligence/feed/"
    ];

    const results = [];
    
    try {
      for (const url of feeds) {
        try {
          const feed = await parser.parseURL(url);
          results.push(...feed.items.map(item => ({
            title: item.title,
            excerpt: item.contentSnippet,
            content: item.content,
            author: item.creator || item.author || "AI News",
            date: item.pubDate,
            websiteUrl: item.link,
            source: new URL(url).hostname
          })));
        } catch (e) {
          console.error(`Failed to fetch blog feed ${url}:`, e);
        }
      }

      // Use AI to summarize and format
      const ai = getAI();
      const processRes = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize these AI news items into blog posts. Return a JSON array with: title, excerpt (short), content (markdown), category (News, Trends, Guides), author, date, slug.
        Raw Data: ${JSON.stringify(results.slice(0, 10))}`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const processedBlogs = JSON.parse(processRes.text);
      res.json({ success: true, count: processedBlogs.length, blogs: processedBlogs });
    } catch (error) {
      console.error("Sync blogs error:", error);
      res.status(500).json({ error: "Failed to sync blogs" });
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
    try {
      const submission = req.body;
      if (!submission || !submission.name) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const payloadSize = JSON.stringify(submission).length;
      console.log(`New tool submission: ${submission.name} (Size: ${payloadSize} bytes)`);
      
      if (payloadSize > 5 * 1024 * 1024) {
        return res.status(413).json({ error: "Payload too large. Please use a smaller logo." });
      }
      
      // MOCK NOTIFICATION: In production, send an email to admin
      console.log(`[NOTIFICATION] New tool submitted: ${submission.name}. Check admin dashboard to approve.`);
      
      res.json({ success: true, message: "Tool submitted for review!" });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(500).json({ error: "Internal server error during submission" });
    }
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

  return app;
}

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  createServer().then(app => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`AIToolScout Server running on http://localhost:${PORT}`);
    });
  });
}
