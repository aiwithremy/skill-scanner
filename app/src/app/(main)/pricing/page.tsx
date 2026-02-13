"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardDecorator } from "@/components/card-decorator";
import { Check, X, ArrowRight, Gift } from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CREDIT_PACKS = [
  {
    name: "Single",
    scans: 1,
    price: "$2",
    priceRaw: 2,
    perScan: "$2.00",
    popular: false,
  },
  {
    name: "Starter",
    scans: 5,
    price: "$5",
    priceRaw: 5,
    perScan: "$1.00",
    popular: false,
  },
  {
    name: "Pro",
    scans: 25,
    price: "$15",
    priceRaw: 15,
    perScan: "$0.60",
    popular: true,
  },
  {
    name: "Team",
    scans: 100,
    price: "$40",
    priceRaw: 40,
    perScan: "$0.40",
    popular: false,
  },
];

interface FeatureRow {
  name: string;
  free: string | boolean;
  paid: string | boolean;
}

const FEATURE_COMPARISON: FeatureRow[] = [
  { name: "Static Analysis (58 regex rules)", free: true, paid: true },
  { name: "Behavioral Analysis (AST dataflow)", free: true, paid: true },
  { name: "LLM-powered semantic review", free: true, paid: true },
  { name: "Meta Analysis (cross-reference)", free: true, paid: true },
  { name: "VirusTotal malware scan", free: true, paid: true },
  { name: "Detailed findings & remediation", free: true, paid: true },
  { name: "Shareable scan reports", free: true, paid: true },
  { name: "Scans per month", free: "1", paid: "Unlimited" },
  { name: "Credits expire", free: "N/A", paid: "Never" },
  { name: "Priority support", free: false, paid: true },
];

const PRICING_FAQ = [
  {
    id: "faq-1",
    question: "How does the free scan work?",
    answer:
      "Every account gets 1 free scan per rolling 30-day period. The free scan includes all 5 security analyzers with full findings and remediation steps — no feature gating. Once used, the free scan resets 30 days from the date it was consumed.",
  },
  {
    id: "faq-2",
    question: "Do credits expire?",
    answer:
      "No. Credits never expire and are permanently tied to your account. Buy them whenever you need them and use them at your own pace.",
  },
  {
    id: "faq-3",
    question: "What happens if a scan fails?",
    answer:
      "Failed or invalid scans never consume a credit. You are only charged when a scan runs successfully and produces results. If the file is corrupted, missing a SKILL.md, or an analyzer errors out, you keep your credit.",
  },
  {
    id: "faq-4",
    question: "Can I get a refund?",
    answer:
      "Unused credits are refundable within 30 days of purchase. Once a credit has been used for a scan, it cannot be refunded. Contact support@skillscanner.xyz for refund requests.",
  },
  {
    id: "faq-5",
    question: "Is there a subscription or recurring charge?",
    answer:
      "No. Skill Scanner uses prepaid credit packs — one-time purchases only. There are no subscriptions, auto-renewals, or recurring charges.",
  },
  {
    id: "faq-6",
    question: "Do I need an account to scan?",
    answer:
      "You can start a scan without an account, but you need to sign up (free) to view results. This lets us associate your free scan and purchased credits with your account.",
  },
  {
    id: "faq-7",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards through Stripe, including Visa, Mastercard, American Express, and more. All payments are processed securely — we never see or store your card details.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-4xl font-semibold md:text-5xl">
              Simple, prepaid pricing
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Every account includes 1 free scan per month. Need more? Buy
              credit packs. No subscriptions, no hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Free Tier */}
      <section className="border-t border-dashed py-12">
        <div className="mx-auto max-w-5xl px-6">
          <Card className="relative rounded-none border-dashed shadow-zinc-950/5">
            <CardDecorator />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gift className="size-5 text-muted-foreground" />
                <CardTitle className="text-xl">Free Tier</CardTitle>
              </div>
              <CardDescription className="mt-1 max-w-lg">
                Every account gets 1 free security scan every 30 days. All 5
                analyzers, full findings, complete remediation steps — no feature
                gating. Sign up and scan.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Button asChild>
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                No credit card required
              </span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Credit Packs */}
      <section className="border-t border-dashed py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Credit Packs
            </h2>
            <p className="mt-4 text-muted-foreground">
              1 credit = 1 scan. Buy once, use anytime. Credits never expire.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CREDIT_PACKS.map((pack) => (
              <Card key={pack.name} className="relative flex flex-col">
                {pack.popular && (
                  <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                    Best value
                  </span>
                )}
                <CardHeader>
                  <CardTitle className="font-medium">{pack.name}</CardTitle>
                  <span className="my-3 block text-3xl font-semibold">
                    {pack.price}
                  </span>
                  <CardDescription className="text-sm">
                    {pack.scans} {pack.scans === 1 ? "scan" : "scans"} &middot;{" "}
                    {pack.perScan}/scan
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <hr className="border-dashed" />
                  <ul className="list-outside space-y-3 text-sm">
                    {[
                      "All 5 security analyzers",
                      "Detailed findings & remediation",
                      "Shareable scan reports",
                      "Credits never expire",
                      "Failed scans not charged",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="size-3 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                  <Button
                    variant={pack.popular ? "default" : "outline"}
                    className="w-full"
                    onClick={() => {
                      // TODO: Redirect to Stripe Checkout
                    }}
                  >
                    Buy {pack.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="border-t border-dashed py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-center text-3xl font-semibold md:text-4xl">
            Feature Comparison
          </h2>

          <div className="mx-auto max-w-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dashed text-left">
                  <th className="pb-3 pr-8 font-medium">Feature</th>
                  <th className="pb-3 pr-8 font-medium">Free</th>
                  <th className="pb-3 font-medium">Paid Credits</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-dashed last:border-0"
                  >
                    <td className="py-3 pr-8">{row.name}</td>
                    <td className="py-3 pr-8">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="size-4" style={{ color: "var(--trust-safe)" }} />
                        ) : (
                          <X className="size-4 text-muted-foreground" />
                        )
                      ) : (
                        <span className="text-muted-foreground">
                          {row.free}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {typeof row.paid === "boolean" ? (
                        row.paid ? (
                          <Check className="size-4" style={{ color: "var(--trust-safe)" }} />
                        ) : (
                          <X className="size-4 text-muted-foreground" />
                        )
                      ) : (
                        <span className="font-medium">{row.paid}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-dashed py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Pricing FAQ
            </h2>
            <p className="mt-4 text-muted-foreground">
              Common questions about billing, credits, and refunds.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <Accordion
              type="single"
              collapsible
              className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
            >
              {PRICING_FAQ.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-dashed"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-dashed py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            Start scanning for free
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Create an account and get your first scan free. No credit card
            required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Scan a Skill</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
