import { useTranslation } from "react-i18next";
import logoUrl from "@assets/maica-logo.png";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Logo and Header */}
      <div className="bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20 dark:to-background border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-6">
            <img src={logoUrl} alt="MaiCa" className="w-20 h-20" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-2">Privacy Policy</h1>
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
              <p>
                This Privacy Policy explains how MaiCa, operated by Zanikon Investment Limited, collects, uses, stores, and protects your information when you use our services.
              </p>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">1. Information We Collect</h2>
                <p className="mb-3">We collect the following information:</p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">a) Personal Information</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Full name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Business name & category</li>
                      <li>Password (encrypted)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold">b) Business & Financial Information</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Sales records</li>
                      <li>Inventory details</li>
                      <li>Expenses</li>
                      <li>Reports generated</li>
                      <li>AI advisory interactions</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold">c) Device & Technical Data</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>IP address</li>
                      <li>Browser type</li>
                      <li>Language settings</li>
                      <li>Device identifiers</li>
                      <li>Usage logs</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 italic text-muted-foreground">Your financial data belongs to you. We only access it to provide services.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
                <p className="mb-2">We use data to:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Provide the MaiCa service</li>
                  <li>Generate financial insights & reports</li>
                  <li>Manage subscriptions and payments</li>
                  <li>Calculate taxes & compliance suggestions</li>
                  <li>Improve business performance analytics</li>
                  <li>Communicate account updates</li>
                  <li>Prevent fraud or misuse</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">3. Legal Basis</h2>
                <p className="mb-2">We process your data under:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Consent</li>
                  <li>Contractual obligation</li>
                  <li>Legitimate business interest</li>
                  <li>Compliance with Nigerian NDPR law</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">4. Data Sharing</h2>
                <p className="mb-2">We do not sell your data.</p>
                <p className="mb-2">We only share with:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Paystack or Flutterwave (for payments)</li>
                  <li>Firebase (secure authentication + database)</li>
                  <li>Email/SMS service providers</li>
                  <li>Regulatory bodies when required by law</li>
                </ul>
                <p className="mt-3 text-muted-foreground">All partners follow strong encryption & security standards.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">5. Data Storage & Security</h2>
                <p className="mb-2">Data is stored securely via:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Industry-standard encryption</li>
                  <li>Secure servers</li>
                  <li>Access control</li>
                  <li>Regular security audits</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">6. Data Retention</h2>
                <p className="text-muted-foreground">We retain data as long as your account is active or as required by law.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">7. User Rights</h2>
                <p className="mb-2">You may:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Request your data</li>
                  <li>Request deletion</li>
                  <li>Update personal info</li>
                  <li>Withdraw consent</li>
                  <li>Opt out of marketing</li>
                </ul>
                <p className="mt-3 text-muted-foreground">Contact: support@maica.com</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">8. Children's Privacy</h2>
                <p className="text-muted-foreground">MaiCa is not for children under 13.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">9. Changes to This Policy</h2>
                <p className="text-muted-foreground">We may update this policy and will notify users when major changes occur.</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mt-6 mb-3">10. Contact</h2>
                <p className="text-muted-foreground">
                  Zanikon Investment Limited<br />
                  Abuja, Nigeria<br />
                  Email: support@maica.com
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t pt-8 mt-12">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
