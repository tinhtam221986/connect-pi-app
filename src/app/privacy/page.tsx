import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4 text-gray-300">Last updated: December 12, 2025</p>

      <div className="space-y-4 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
          <p>
            Welcome to Connect Pi Network. We respect your privacy and are committed to protecting your personal data.
            This privacy policy explains how we collect, use, and share your personal information when you use our application within the Pi Network ecosystem.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. Data We Collect</h2>
          <p>We collect the following information:</p>
          <ul className="list-disc pl-5 mt-2">
            <li><strong>Pi Network Account Information:</strong> Username and User ID (UID) provided via the Pi SDK.</li>
            <li><strong>Content:</strong> Videos, comments, and other content you upload or post.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Your Data</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Authenticate your identity using Pi Network.</li>
            <li>Provide and improve the social video experience.</li>
            <li>Process transactions (if applicable).</li>
          </ul>
        </section>

         <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share data with third-party service providers (like Cloudinary for video storage) strictly for the purpose of providing the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through the app support channels.
          </p>
        </section>
      </div>
    </div>
  );
}
