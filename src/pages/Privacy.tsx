import SEO from "@/src/components/seo/SEO";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <SEO title="Privacy Policy | AIToolScout" description="Our commitment to your privacy." />
      <div className="max-w-3xl mx-auto prose prose-gray">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <p className="text-gray-500 mb-6">Last updated: March 2024</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or submit a tool.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>
        
        <h2>3. Data Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
      </div>
    </div>
  );
}
