import logoUrl from "@assets/ChatGPT Image Nov 10, 2025, 03_16_37 AM_1762741083316.png";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Logo and Header */}
      <div className="bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20 dark:to-background border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-6">
            <img src={logoUrl} alt="KudiManager" className="w-20 h-20" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-2">Terms & Conditions</h1>
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
              <p>These Terms govern your use of KudiManager. By using the platform, you agree to them.</p>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">1. Definitions</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>"Service"</strong> — KudiManager application (web + mobile)</p>
                  <p><strong>"User"</strong> — any registered or unregistered person using KudiManager</p>
                  <p><strong>"We", "Us", "Our"</strong> — Zanikon Investment Limited</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">2. User Obligations</h2>
                <p className="mb-2">You agree to:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Provide accurate information</li>
                  <li>Use the platform legally</li>
                  <li>Not misuse or attempt to hack the system</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">3. Subscription & Payments</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>First 3 months are free</li>
                  <li>After that, subscription must be renewed</li>
                  <li>N2,500 monthly basic plan</li>
                  <li>N5,000 premium (AI reports, detailed analytics)</li>
                  <li>Payments are processed via Paystack / Flutterwave</li>
                  <li>No refunds for already active subscription periods</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">4. Acceptable Use</h2>
                <p className="mb-2">You may not:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Copy, reverse engineer or resell the app</li>
                  <li>Upload harmful content or viruses</li>
                  <li>Access data that isn't yours</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">5. Financial & Tax Advice Disclaimer</h2>
                <p className="mb-3 text-muted-foreground">KudiManager provides automated AI suggestions, not certified tax or financial advice.</p>
                <p className="mb-2">Users remain responsible for:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Paying correct taxes</li>
                  <li>Following legal and financial regulations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">6. Termination</h2>
                <p className="text-muted-foreground">We may suspend or terminate accounts that violate our policies.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">7. Limitation of Liability</h2>
                <p className="mb-2">Zanikon Investment Limited is not liable for:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Incorrect financial inputs by users</li>
                  <li>Business losses</li>
                  <li>Downtime due to internet or provider issues</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">8. Governing Law</h2>
                <p className="text-muted-foreground">These Terms follow the laws of the Federal Republic of Nigeria.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">9. Contact</h2>
                <p className="text-muted-foreground">support@kudimanager.com</p>
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
                href="/refund"
                className="p-4 border rounded-lg hover:bg-accent dark:hover:bg-accent/50 transition-colors"
              >
                <h3 className="font-semibold mb-1">Refund Policy</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about refunds and cancellations
                </p>
              </a>
              <a
                href="/data-protection"
                className="p-4 border rounded-lg hover:bg-accent dark:hover:bg-accent/50 transition-colors"
              >
                <h3 className="font-semibold mb-1">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  NDPR and data protection information
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
                href="mailto:support@kudimanager.com"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                support@kudimanager.com
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
