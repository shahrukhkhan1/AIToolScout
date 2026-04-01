import { AITool, Category, BlogPost } from "./types";

export const CATEGORIES: Category[] = [
  { id: "writing", name: "Writing", icon: "PenTool", description: "AI tools for content creation, copywriting, and editing." },
  { id: "image", name: "Image Generation", icon: "Image", description: "Create stunning visuals and art with AI." },
  { id: "video", name: "Video", icon: "Video", description: "AI-powered video editing and generation." },
  { id: "code", name: "Coding", icon: "Code", description: "AI assistants for developers and software engineers." },
  { id: "marketing", name: "Marketing", icon: "Megaphone", description: "AI tools to boost your marketing efforts." },
  { id: "productivity", name: "Productivity", icon: "Zap", description: "Optimize your workflow with AI assistants." },
  { id: "audio", name: "Audio", icon: "Music", description: "AI for music, voiceovers, and audio editing." },
  { id: "business", name: "Business", icon: "Briefcase", description: "AI tools for business automation and analysis." },
];

export const TOOLS: AITool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "The most popular AI chatbot by OpenAI, capable of generating text, code, and more.",
    category: "writing",
    tags: ["chatbot", "writing", "productivity", "openai"],
    url: "https://chat.openai.com",
    imageUrl: "https://picsum.photos/seed/chatgpt/400/300",
    pricing: "Freemium",
    rating: 4.8,
    reviewsCount: 1250,
    isFeatured: true,
    createdAt: "2024-01-01"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "High-quality AI image generation tool that operates via Discord.",
    category: "image",
    tags: ["image", "art", "design", "creative"],
    url: "https://midjourney.com",
    imageUrl: "https://picsum.photos/seed/midjourney/400/300",
    pricing: "Paid",
    rating: 4.9,
    reviewsCount: 850,
    isFeatured: true,
    createdAt: "2024-01-05"
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "Your AI pair programmer that helps you write code faster.",
    category: "code",
    tags: ["coding", "developer", "productivity", "github"],
    url: "https://github.com/features/copilot",
    imageUrl: "https://picsum.photos/seed/copilot/400/300",
    pricing: "Paid",
    rating: 4.7,
    reviewsCount: 600,
    isFeatured: false,
    createdAt: "2024-01-10"
  },
  {
    id: "jasper",
    name: "Jasper",
    description: "AI content platform that helps teams create high-quality content faster.",
    category: "writing",
    tags: ["writing", "marketing", "copywriting", "content"],
    url: "https://jasper.ai",
    imageUrl: "https://picsum.photos/seed/jasper/400/300",
    pricing: "Paid",
    rating: 4.5,
    reviewsCount: 450,
    isFeatured: false,
    createdAt: "2024-01-15"
  },
  {
    id: "canva-magic",
    name: "Canva Magic Studio",
    description: "All-in-one AI design tools integrated into the Canva platform.",
    category: "marketing",
    tags: ["design", "marketing", "social media"],
    url: "https://canva.com",
    imageUrl: "https://picsum.photos/seed/canva/400/300",
    pricing: "Freemium",
    rating: 4.6,
    reviewsCount: 320,
    isFeatured: true,
    createdAt: "2024-02-01"
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    description: "AI-powered workspace for notes, tasks, and project management.",
    category: "productivity",
    tags: ["productivity", "notes", "organization"],
    url: "https://notion.so",
    imageUrl: "https://picsum.photos/seed/notion/400/300",
    pricing: "Freemium",
    rating: 4.7,
    reviewsCount: 540,
    isFeatured: false,
    createdAt: "2024-02-10"
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "The most realistic AI text-to-speech and voice cloning software.",
    category: "audio",
    tags: ["audio", "voice", "speech"],
    url: "https://elevenlabs.io",
    imageUrl: "https://picsum.photos/seed/elevenlabs/400/300",
    pricing: "Freemium",
    rating: 4.9,
    reviewsCount: 210,
    isFeatured: true,
    createdAt: "2024-02-20"
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    description: "AI marketing platform for high-converting copy and content.",
    category: "writing",
    tags: ["writing", "marketing", "copywriting"],
    url: "https://copy.ai",
    imageUrl: "https://picsum.photos/seed/copyai/400/300",
    pricing: "Freemium",
    rating: 4.4,
    reviewsCount: 380,
    isFeatured: false,
    createdAt: "2024-03-01"
  },
  {
    id: "leonardo-ai",
    name: "Leonardo.ai",
    description: "Create production-quality visual assets for your projects with unprecedented speed.",
    category: "image",
    tags: ["image", "art", "design", "assets"],
    url: "https://leonardo.ai",
    imageUrl: "https://picsum.photos/seed/leonardo/400/300",
    pricing: "Freemium",
    rating: 4.8,
    reviewsCount: 420,
    isFeatured: true,
    createdAt: "2024-03-05"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "best-ai-writing-tools-2024",
    title: "Top 10 AI Writing Tools for 2024",
    excerpt: "Discover the best AI tools to supercharge your content creation process this year.",
    content: "# Top 10 AI Writing Tools\n\nAI is transforming how we write...",
    author: "Aura Team",
    date: "2024-03-15",
    category: "Guides",
    imageUrl: "https://picsum.photos/seed/writing-blog/800/400",
    slug: "best-ai-writing-tools-2024",
    tags: ["writing", "productivity", "AI tools"]
  }
];
