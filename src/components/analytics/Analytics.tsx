import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Mock Google Analytics Integration
// In production, you would use a library like 'react-ga4'
export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const gaId = process.env.VITE_GA_ID;
    if (!gaId) return;

    // Track Page View
    console.log(`[Analytics] Page View: ${location.pathname}${location.search}`);
    
    // Example: window.gtag('config', gaId, { page_path: location.pathname });
  }, [location]);

  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    console.log(`[Analytics] Event: ${category} - ${action} ${label ? `(${label})` : ""}`);
    // Example: window.gtag('event', action, { event_category: category, event_label: label, value });
  };

  return { trackEvent };
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}
