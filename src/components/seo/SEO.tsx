import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  schema?: any;
}

export default function SEO({ title, description, canonical, ogImage, schema }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | AIToolScout`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // JSON-LD Schema
    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [title, description, schema]);

  return null;
}

export function generateSoftwareSchema(tool: any) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "operatingSystem": "Web",
    "applicationCategory": tool.category,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.rating,
      "ratingCount": tool.reviewsCount
    },
    "offers": {
      "@type": "Offer",
      "price": tool.pricing === "Free" ? "0" : "1",
      "priceCurrency": "USD"
    }
  };
}
