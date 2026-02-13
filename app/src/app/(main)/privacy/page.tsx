import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Skill Scanner",
  description: "Privacy Policy for Skill Scanner (skillscanner.xyz).",
};

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: February 13, 2026
          </p>

          <hr className="my-8 border-dashed" />

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80 [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mb-3">
            <div>
              <h2>1. Introduction</h2>
              <p>
                Skill Scanner (&quot;Service,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) operates skillscanner.xyz.
                This Privacy Policy describes how we collect, use, store, and
                protect your personal information when you use our Service. By
                using the Service, you consent to the practices described in
                this policy.
              </p>
            </div>

            <div>
              <h2>2. Data We Collect</h2>
              <p>We collect the following categories of information:</p>

              <p className="font-medium text-foreground">Account Information</p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  Email address (via email/password registration, Google OAuth,
                  or GitHub OAuth)
                </li>
                <li>Display name (if provided)</li>
                <li>
                  Authentication provider identifiers (Google ID, GitHub ID)
                </li>
                <li>Account creation and last sign-in timestamps</li>
              </ul>

              <p className="font-medium text-foreground">Scan Data</p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  Uploaded files (temporarily, deleted immediately after scan
                  completion)
                </li>
                <li>
                  File hash (SHA-256, retained for duplicate detection)
                </li>
                <li>GitHub repository URLs submitted for scanning</li>
                <li>
                  Scan results including trust labels, findings, severity
                  levels, analyzer outputs, confidence scores, and remediation
                  recommendations
                </li>
              </ul>

              <p className="font-medium text-foreground">Billing Data</p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  Credit balance and transaction history (purchases and
                  deductions)
                </li>
                <li>
                  Stripe customer ID and payment metadata (we do not store
                  credit card numbers, CVVs, or full card details)
                </li>
              </ul>

              <p className="font-medium text-foreground">Usage Data</p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  Standard server logs (IP address, browser user-agent, request
                  timestamps, pages visited)
                </li>
                <li>Free scan usage dates for rate-limit enforcement</li>
              </ul>
            </div>

            <div>
              <h2>3. File Deletion Policy</h2>
              <p>
                We take file privacy seriously. Uploaded files are stored in a
                temporary Supabase storage bucket solely for the duration of
                the scanning process. Once the scan completes (successfully or
                with an error), the uploaded file is permanently deleted from
                our storage. We do not retain, archive, or back up uploaded
                files.
              </p>
              <p>
                We retain a SHA-256 hash of each scanned file for duplicate
                detection. This hash cannot be used to reconstruct the original
                file.
              </p>
            </div>

            <div>
              <h2>4. Scan Result Retention</h2>
              <p>
                Scan results — including trust labels, individual findings,
                severity classifications, analyzer outputs, and remediation
                recommendations — are stored indefinitely and associated with
                your account. You may delete individual scan results at any
                time from your dashboard. Deleting your account removes all
                associated scan results.
              </p>
            </div>

            <div>
              <h2>5. How We Use Your Data</h2>
              <p>We use your data to:</p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  Provide the Service: process uploaded files, run security
                  analyzers, and deliver scan results
                </li>
                <li>
                  Manage your account: authentication, credit balance, and scan
                  history
                </li>
                <li>
                  Process payments: facilitate credit purchases through Stripe
                </li>
                <li>
                  Detect duplicates: warn you if a file has been previously
                  scanned
                </li>
                <li>
                  Enforce rate limits: track free scan usage per 30-day rolling
                  period
                </li>
                <li>
                  Improve the Service: aggregate, anonymized analytics to
                  understand usage patterns
                </li>
                <li>
                  Communicate: transactional emails (account verification,
                  password resets, purchase receipts)
                </li>
              </ul>
              <p>
                We do not sell your personal information. We do not use your
                uploaded files or scan results for advertising, marketing, or
                training machine learning models.
              </p>
            </div>

            <div>
              <h2>6. Third-Party Services</h2>
              <p>
                We use the following third-party services to operate the
                Service. Each processes data on our behalf under their
                respective privacy policies:
              </p>

              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  <span className="font-medium text-foreground">
                    Supabase
                  </span>{" "}
                  — Authentication (email/password, Google OAuth, GitHub OAuth),
                  PostgreSQL database for user profiles, scans, findings, and
                  credit transactions, and temporary file storage during
                  scanning.
                </li>
                <li>
                  <span className="font-medium text-foreground">Stripe</span>{" "}
                  — Payment processing for credit pack purchases. Stripe
                  collects and processes payment information directly; we
                  receive only a customer ID and payment confirmation metadata.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Railway
                  </span>{" "}
                  — Hosts the Python scanner backend. Uploaded files are
                  transmitted to Railway for analysis and deleted after
                  processing.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    LLM Provider
                  </span>{" "}
                  — Portions of skill file content are sent to a large language
                  model for semantic security analysis. No personally
                  identifiable information is included in LLM requests.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    VirusTotal
                  </span>{" "}
                  — File hashes and, where applicable, file content are
                  submitted to VirusTotal for malware detection. VirusTotal may
                  retain submitted files per their own retention policies.
                </li>
              </ul>

              <p>
                We also use Vercel to host the frontend application. Vercel may
                collect standard server-side request logs (IP addresses, request
                URLs, timestamps).
              </p>
            </div>

            <div>
              <h2>7. Cookies</h2>
              <p>
                We use only essential cookies required for the Service to
                function:
              </p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  <span className="font-medium text-foreground">
                    Authentication cookies
                  </span>{" "}
                  — Managed by Supabase Auth to maintain your login session.
                  These are httpOnly, secure, same-site cookies.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Theme preference
                  </span>{" "}
                  — A local storage value to remember your light/dark mode
                  selection.
                </li>
              </ul>
              <p>
                We do not use analytics cookies, advertising cookies, or
                third-party tracking pixels.
              </p>
            </div>

            <div>
              <h2>8. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect
                your data, including:
              </p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  HTTPS/TLS encryption for all data in transit
                </li>
                <li>
                  Supabase Row Level Security (RLS) policies ensuring users can
                  only access their own data
                </li>
                <li>
                  Encrypted database connections and at-rest encryption via
                  Supabase
                </li>
                <li>
                  Stripe PCI-DSS compliant payment processing
                </li>
                <li>
                  Immediate deletion of uploaded files after scan completion
                </li>
              </ul>
              <p>
                No method of electronic storage or transmission is 100% secure.
                While we strive to protect your data, we cannot guarantee
                absolute security.
              </p>
            </div>

            <div>
              <h2>9. Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have the following
                rights regarding your personal data:
              </p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  <span className="font-medium text-foreground">Access</span>{" "}
                  — Request a copy of the personal data we hold about you
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Rectification
                  </span>{" "}
                  — Request correction of inaccurate personal data
                </li>
                <li>
                  <span className="font-medium text-foreground">Erasure</span>{" "}
                  — Request deletion of your personal data and account
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Data Portability
                  </span>{" "}
                  — Request a machine-readable export of your data
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Restriction
                  </span>{" "}
                  — Request that we limit the processing of your data
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Objection
                  </span>{" "}
                  — Object to the processing of your data for certain purposes
                </li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:privacy@skillscanner.xyz"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  privacy@skillscanner.xyz
                </a>
                . We will respond within 30 days.
              </p>
            </div>

            <div>
              <h2>10. GDPR Compliance</h2>
              <p>
                For users in the European Economic Area (EEA), United Kingdom,
                and Switzerland:
              </p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  <span className="font-medium text-foreground">
                    Legal Basis
                  </span>{" "}
                  — We process your data based on: (a) your consent when you
                  create an account, (b) contractual necessity to provide the
                  Service, and (c) legitimate interests in maintaining security
                  and preventing abuse.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Data Transfers
                  </span>{" "}
                  — Your data may be processed in the United States by our
                  service providers (Supabase, Stripe, Railway, Vercel). These
                  transfers are protected by Standard Contractual Clauses and
                  other appropriate safeguards.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Data Protection Officer
                  </span>{" "}
                  — For GDPR-related inquiries, contact{" "}
                  <a
                    href="mailto:privacy@skillscanner.xyz"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    privacy@skillscanner.xyz
                  </a>
                  .
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Supervisory Authority
                  </span>{" "}
                  — You have the right to lodge a complaint with your local data
                  protection authority.
                </li>
              </ul>
            </div>

            <div>
              <h2>11. Children&apos;s Privacy</h2>
              <p>
                The Service is not directed at individuals under the age of 16.
                We do not knowingly collect personal information from children.
                If we become aware that we have inadvertently collected data
                from a child under 16, we will delete that data promptly.
              </p>
            </div>

            <div>
              <h2>12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by posting the updated policy on
                this page with a revised &quot;Last updated&quot; date. For
                significant changes, we may also notify you via email.
                Continued use of the Service after changes constitutes
                acceptance of the revised policy.
              </p>
            </div>

            <div>
              <h2>13. Contact</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or
                our data practices, contact us at{" "}
                <a
                  href="mailto:privacy@skillscanner.xyz"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  privacy@skillscanner.xyz
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
