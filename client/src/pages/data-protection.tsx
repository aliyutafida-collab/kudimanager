import logoUrl from "@assets/maica-logo.png";

export default function DataProtection() {
  return (
    <div className="min-h-screen bg-background">
      {/* Logo and Header */}
      <div className="bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20 dark:to-background border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-6">
            <img src={logoUrl} alt="MaiCa" className="w-20 h-20" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-2">
            Data Protection & NDPR
          </h1>
          <p className="text-center text-muted-foreground">
            Last Updated: November 21, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Legal Text */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="space-y-4 text-sm leading-relaxed">
              <p className="text-muted-foreground">This policy ensures MaiCa complies with the Nigerian Data Protection Regulation (NDPR).</p>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">1. Data Controller</h2>
                <p className="text-muted-foreground">
                  Zanikon Investment Limited<br />
                  Email: support@maica.com
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">2. What Data We Process</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Personal identification data</li>
                  <li>Financial records input by users</li>
                  <li>Device information</li>
                  <li>Usage analytics</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">3. Consent</h2>
                <p className="mb-2">User consent is required for:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Marketing communication</li>
                  <li>AI advisory emails</li>
                  <li>Data analytics</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">4. Data Minimization</h2>
                <p className="text-muted-foreground">We process only what is required for service delivery.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">5. Data Protection Principles</h2>
                <p className="mb-2">We follow NDPR principles:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Lawfulness</li>
                  <li>Transparency</li>
                  <li>Security</li>
                  <li>Data minimization</li>
                  <li>Accuracy</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">6. Third-Party Processors</h2>
                <p className="mb-2">We use:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Paystack</li>
                  <li>Flutterwave</li>
                  <li>Firebase</li>
                  <li>SendGrid/SMTP</li>
                  <li>Vercel servers</li>
                </ul>
                <p className="mt-3 text-muted-foreground">All third parties are compliant with NDPR/GDPR standards.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">7. User Rights Under NDPR</h2>
                <p className="mb-2">Users may request:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Data access</li>
                  <li>Correction</li>
                  <li>Export</li>
                  <li>Deletion</li>
                </ul>
                <p className="mt-3 text-muted-foreground">Requests: support@maica.com</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">8. Breach Notification</h2>
                <p className="text-muted-foreground">We will notify affected users within 72 hours of any data breach.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">9. Enforcement</h2>
                <p className="text-muted-foreground">Zanikon Investment Limited will enforce disciplinary actions for internal breaches.</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t pt-8 mt-12">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/privacy"
                className="p-4 border rounded-lg hover:bg-accent dark:hover:bg-accent/50 transition-colors"
              >
                <h3 className="font-semibold mb-1">Privacy Policy</h3>
                <p className="text-sm text-muted-foreground">
                  See how we handle your data
                </p>
              </a>
              <a
                href="/terms"
                className="p-4 border rounded-lg hover:bg-accent dark:hover:bg-accent/50 transition-colors"
              >
                <h3 className="font-semibold mb-1">Terms & Conditions</h3>
                <p className="text-sm text-muted-foreground">
                  Read our terms of service
                </p>
              </a>
              <a
                href="/refund"
                className="p-4 border rounded-lg hover:bg-accent dark:hover:bg-accent/50 transition-colors"
              >
                <h3 className="font-semibold mb-1">Refund Policy</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about refunds and cancellations
                </p>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
            <h3 className="font-bold mb-2">Have Questions?</h3>
            <p className="text-sm text-muted-foreground">
              Contact us at:{" "}
              <a
                href="mailto:support@maica.com"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                support@maica.com
              </a>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Response time: 7 business days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
