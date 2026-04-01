import SEO from "@/src/components/seo/SEO";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <SEO title="Cookie Policy | AIToolScout" description="How we use cookies." />
      <div className="max-w-3xl mx-auto prose prose-gray">
        <h1 className="text-4xl font-black mb-8">Cookie Policy</h1>
        <p className="text-gray-500 mb-6">Last updated: March 2024</p>
        
        <h2>1. What are Cookies?</h2>
        <p>Cookies are small text files that are stored on your device when you visit a website.</p>
        
        <h2>2. How We Use Cookies</h2>
        <p>We use cookies to understand how you use our site, to remember your preferences, and to improve your experience.</p>
        
        <h2>3. Managing Cookies</h2>
        <p>You can control and manage cookies through your browser settings.</p>
      </div>
    </div>
  );
}
