import logoUrl from "@assets/ChatGPT Image Nov 10, 2025, 03_16_37 AM_1762741083316.png";

export default function Refund() {
  return (
    <div className="min-h-screen bg-background">
      {/* Logo and Header */}
      <div className="bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20 dark:to-background border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-6">
            <img src={logoUrl} alt="KudiManager" className="w-20 h-20" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-2">Refund Policy</h1>
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
              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">1. Subscription Refunds</h2>
                <p className="mb-3 text-muted-foreground">KudiManager offers digital services billed monthly or annually.</p>
                
                <h3 className="font-semibold mt-4 mb-2">We do not offer refunds for:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Partially used subscription periods</li>
                  <li>Mistaken payments by users</li>
                  <li>AI-generated insights</li>
                </ul>

                <h3 className="font-semibold mt-4 mb-2">Refunds may be granted if:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>There is a proven technical fault caused by us</li>
                  <li>Duplicate billing occurred</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">2. Cancellations</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Users can cancel anytime from the subscription page</li>
                  <li>Services remain active until the end of the billing cycle</li>
                  <li>No fees for cancellation</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">3. Payment Disputes</h2>
                <p className="mb-2">Handled through:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Paystack dispute channels</li>
                  <li>Flutterwave dispute channels</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">4. Business Users</h2>
                <p className="text-muted-foreground">All business users must comply with Paystack/Flutterwave policies.</p>
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
