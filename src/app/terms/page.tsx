import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4 text-gray-300">Last updated: December 12, 2025</p>

      <div className="space-y-4 text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Connect Pi Network, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Post illegal, harmful, or offensive content.</li>
            <li>Violate the intellectual property rights of others.</li>
            <li>Attempt to manipulate the reward system or exploit the application.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. Pi Network Integration</h2>
          <p>
            Our service is integrated with the Pi Network. You acknowledge that your use of the service is also subject to the Pi Network's terms and policies.
            We are not responsible for any issues arising from the Pi Network platform itself.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account if you violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">5. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Your continued use of the service constitutes acceptance of the modified terms.
          </p>
        </section>
      </div>
    </div>
  );
}
