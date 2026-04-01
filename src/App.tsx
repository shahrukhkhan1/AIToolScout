import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/error/ErrorBoundary";
import AnalyticsProvider from "./components/analytics/Analytics";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home"));
const ToolDetail = lazy(() => import("./pages/ToolDetail"));
const Submit = lazy(() => import("./pages/Submit"));
const ProgrammaticPage = lazy(() => import("./pages/ProgrammaticPage"));
const ComparisonPage = lazy(() => import("./pages/ComparisonPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFound = lazy(() => import("./pages/NotFound"));
import RequireAdmin from "./components/auth/RequireAdmin";

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Placeholder pages for now
const AdvertisePage = () => <div className="p-20 text-center font-bold">Advertise with AIToolScout</div>;
const DealsPage = () => <div className="p-20 text-center font-bold">Exclusive AI Tool Deals</div>;

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AnalyticsProvider>
          <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/tool/:id" element={<ToolDetail />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/submit" element={<Submit />} />
                <Route path="/best-ai-tools-for-:audience" element={<ProgrammaticPage />} />
                <Route path="/compare/:slug" element={<ComparisonPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                } />
                <Route path="/advertise" element={<AdvertisePage />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </AnalyticsProvider>
      </Router>
    </ErrorBoundary>
  );
}
