import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Skill Scanner",
  description: "Terms of Service for Skill Scanner (skillscanner.xyz).",
};

export default function TermsPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-semibold">Terms of Service</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: February 13, 2026
          </p>

          <hr className="my-8 border-dashed" />

          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80 [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mb-3">
            <div>
              <h2>1. Service Description</h2>
              <p>
                Skill Scanner (&quot;Service,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) is a web-based application
                operated at skillscanner.xyz that scans AI agent skill files for
                security threats including prompt injections, data exfiltration,
                malicious code, obfuscation, and related vulnerabilities. The
                Service analyzes uploaded files and GitHub-hosted skills using
                five security analyzers (Static Analysis, Behavioral Analysis,
                LLM Analysis, Meta Analysis, and VirusTotal) and returns a trust
                label rating with detailed findings.
              </p>
            </div>

            <div>
              <h2>2. Acceptance of Terms</h2>
              <p>
                By accessing or using the Service, you agree to be bound by
                these Terms of Service (&quot;Terms&quot;). If you do not agree,
                you may not use the Service. We reserve the right to modify
                these Terms at any time. Continued use of the Service after
                changes constitutes acceptance of the revised Terms.
              </p>
            </div>

            <div>
              <h2>3. Account Registration</h2>
              <p>
                You may initiate a scan without an account, but you must create
                an account to view scan results. You are responsible for
                maintaining the confidentiality of your account credentials and
                for all activities under your account. You agree to provide
                accurate, current, and complete information during registration
                and to keep it updated. You must notify us immediately of any
                unauthorized use of your account.
              </p>
            </div>

            <div>
              <h2>4. Credits and Payment</h2>
              <p>
                The Service operates on a prepaid credit system. Each account
                receives 1 free scan per rolling 30-day period. Additional scans
                require credits purchased through the Service via Stripe.
              </p>
              <p>
                Credit packs are available at the following rates: 1 credit for
                $2, 5 credits for $5, 25 credits for $15, and 100 credits for
                $40. Credits never expire and are non-transferable between
                accounts.
              </p>
              <p>
                Failed, invalid, or errored scans do not consume credits. A
                credit is only deducted upon successful completion of a scan.
                Unused credits are refundable within 30 days of purchase. Used
                credits are non-refundable. All prices are in US dollars and
                exclude applicable taxes.
              </p>
            </div>

            <div>
              <h2>5. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="mb-3 ml-4 list-disc space-y-1.5">
                <li>
                  Use the Service to scan files you do not have the right to
                  analyze
                </li>
                <li>
                  Upload files containing illegal content or malware intended
                  to attack the Service
                </li>
                <li>
                  Attempt to reverse-engineer, decompile, or exploit the
                  Service&apos;s infrastructure
                </li>
                <li>
                  Use automated means to access the Service beyond its intended
                  API
                </li>
                <li>
                  Resell, redistribute, or commercially exploit scan results
                  without permission
                </li>
                <li>
                  Circumvent rate limits, authentication, or credit
                  requirements
                </li>
                <li>
                  Upload files exceeding the 25MB size limit or in unsupported
                  formats
                </li>
              </ul>
            </div>

            <div>
              <h2>6. Data Handling</h2>
              <p>
                Uploaded files are stored temporarily during scanning and
                deleted immediately after scan completion. We do not retain
                copies of your uploaded files. We store a cryptographic hash of
                each file for duplicate detection purposes.
              </p>
              <p>
                Scan results (including trust labels, findings, severity levels,
                and remediation recommendations) are stored indefinitely and
                associated with your account. You may delete individual scan
                results from your dashboard at any time.
              </p>
              <p>
                For full details on data handling, see our{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <div>
              <h2>7. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT.
              </p>
              <p>
                We do not guarantee that the Service will detect all security
                threats in a given file. A &quot;Safe&quot; trust label does not
                constitute a warranty that the scanned skill is free of
                vulnerabilities. The Service is a tool to assist in security
                review, not a substitute for professional security auditing.
                You should always exercise your own judgment when installing
                third-party AI agent skills.
              </p>
            </div>

            <div>
              <h2>8. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                SHALL SKILL SCANNER, ITS OPERATORS, AFFILIATES, OR SERVICE
                PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED
                TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE
                LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OR INABILITY TO
                USE THE SERVICE.
              </p>
              <p>
                Our total liability for any claim arising from or related to the
                Service shall not exceed the amount you paid to us in the 12
                months preceding the claim.
              </p>
            </div>

            <div>
              <h2>9. Intellectual Property</h2>
              <p>
                The Service, its design, underlying technology, and all
                associated intellectual property are owned by Skill Scanner. You
                retain ownership of all files you upload. By using the Service,
                you grant us a limited, temporary license to process your
                uploaded files solely for the purpose of performing security
                analysis.
              </p>
            </div>

            <div>
              <h2>10. Third-Party Services</h2>
              <p>
                The Service integrates with third-party services including
                Supabase (authentication and data storage), Stripe (payment
                processing), VirusTotal (malware scanning), and LLM providers
                (semantic analysis). Your use of these services is subject to
                their respective terms and policies. We are not responsible for
                the actions or omissions of third-party service providers.
              </p>
            </div>

            <div>
              <h2>11. Termination</h2>
              <p>
                We may suspend or terminate your account at our sole discretion
                if you violate these Terms or engage in conduct that we
                determine is harmful to the Service, other users, or third
                parties. You may delete your account at any time through your
                dashboard settings.
              </p>
              <p>
                Upon termination, your right to use the Service ceases
                immediately. Any unused credits at the time of termination due
                to a Terms violation are forfeited. If you voluntarily close
                your account, unused credits purchased within the last 30 days
                are eligible for a refund.
              </p>
            </div>

            <div>
              <h2>12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Delaware, United States, without
                regard to conflict of law principles. Any disputes arising from
                these Terms or the Service shall be resolved through binding
                arbitration in accordance with the rules of the American
                Arbitration Association.
              </p>
            </div>

            <div>
              <h2>13. Contact</h2>
              <p>
                If you have questions about these Terms, contact us at{" "}
                <a
                  href="mailto:legal@skillscanner.xyz"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  legal@skillscanner.xyz
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
