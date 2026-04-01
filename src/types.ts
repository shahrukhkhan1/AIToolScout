export interface AITool {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  websiteUrl: string;
  affiliateUrl?: string;
  imageUrl: string;
  isFeatured?: boolean;
  pricing: "Free" | "Freemium" | "Paid";
  rating: number;
  reviewsCount: number;
  features?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  slug: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}
