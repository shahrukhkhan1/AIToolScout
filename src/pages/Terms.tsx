import SEO from "@/src/components/seo/SEO";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <SEO title="Terms of Service | AIToolScout" description="Our terms and conditions." />
      <div className="max-w-3xl mx-auto prose prose-gray">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <p className="text-gray-500 mb-6">Last updated: March 2024</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using AIToolScout, you agree to be bound by these Terms of Service.</p>
        
        <h2>2. User Conduct</h2>
        <p>You agree not to use our services for any unlawful purpose or in any way that could harm, disable, or overburden our platform.</p>
        
        <h2>3. Intellectual Property</h2>
        <p>The content on AIToolScout, including text, graphics, and logos, is the property of AIToolScout and is protected by copyright laws.</p>
      </div>
    </div>
  );
}
