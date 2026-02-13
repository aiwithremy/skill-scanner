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
import { UploadZone } from "@/components/upload-zone";
import { GitHubUrlInput } from "@/components/github-url-input";
import { Upload, Search, Shield, Check, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-50 contain-strict lg:block"
        >
          <div className="h-[80rem] w-[35rem] -translate-y-[22rem] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-20 md:pb-24 md:pt-28">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-4xl font-semibold md:text-5xl lg:text-6xl">
              Is this skill safe to install?
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Scan AI agent skills for prompt injections, data exfiltration,
              malicious code, and more. Get a trust rating in seconds.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-lg">
            <UploadZone />

            <div className="my-6 flex items-center gap-4">
              <hr className="flex-1 border-dashed" />
              <span className="text-xs text-muted-foreground">
                or scan from GitHub
              </span>
              <hr className="flex-1 border-dashed" />
            </div>

            <GitHubUrlInput />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-t border-dashed py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-semibold md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Three steps to verify any AI agent skill is safe.
          </p>

          <div className="mx-auto mt-12 grid gap-4 lg:grid-cols-3">
            {[
              {
                icon: Upload,
                step: "1",
                title: "Upload or paste a URL",
                description:
                  "Drop a .zip or .skill file, or paste a GitHub repository URL containing a SKILL.md file.",
              },
              {
                icon: Search,
                step: "2",
                title: "5 engines analyze it",
                description:
                  "Static analysis, behavioral analysis, LLM-powered review, meta analysis, and VirusTotal scanning.",
              },
              {
                icon: Shield,
                step: "3",
                title: "Get your trust rating",
                description:
                  "See a clear Safe / Caution / Unsafe / Dangerous label with detailed findings and remediation steps.",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="group relative rounded-none shadow-zinc-950/5"
              >
                <CardDecorator />
                <CardHeader className="p-6">
                  <span className="text-muted-foreground flex items-center gap-2 text-sm">
                    <item.icon className="size-4" />
                    Step {item.step}
                  </span>
                  <p className="mt-4 text-xl font-semibold">{item.title}</p>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <hr className="mb-4 border-dashed" />
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-dashed py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Simple, prepaid pricing
            </h2>
            <p className="text-muted-foreground">
              1 free scan every 30 days. Buy credit packs when you need more.
              Credits never expire.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Single",
                scans: 1,
                price: "$2",
                perScan: "$2.00",
                popular: false,
              },
              {
                name: "Starter",
                scans: 5,
                price: "$5",
                perScan: "$1.00",
                popular: false,
              },
              {
                name: "Pro",
                scans: 25,
                price: "$15",
                perScan: "$0.60",
                popular: true,
              },
              {
                name: "Team",
                scans: 100,
                price: "$40",
                perScan: "$0.40",
                popular: false,
              },
            ].map((pack) => (
              <Card key={pack.name} className="relative flex flex-col">
                {pack.popular && (
                  <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                    Best value
                  </span>
                )}
                <CardHeader>
                  <CardTitle className="font-medium">{pack.name}</CardTitle>
                  <span className="my-3 block text-2xl font-semibold">
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
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                  <Button
                    asChild
                    variant={pack.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    <Link href="/pricing">Buy {pack.name}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-dashed py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know about Skill Scanner.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <Accordion
              type="single"
              collapsible
              className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
            >
              {[
                {
                  id: "item-1",
                  question: "What types of files can I scan?",
                  answer:
                    "You can upload .zip or .skill files (up to 25MB) containing an AI agent skill with a SKILL.md file. You can also paste a GitHub repository URL and we'll fetch the skill for you.",
                },
                {
                  id: "item-2",
                  question: "What does the scan check for?",
                  answer:
                    "We run 5 security analyzers: Static Analysis (58 rules for prompt injection, command injection, etc.), Behavioral Analysis (AST-based dataflow for exfiltration chains), LLM Analysis (semantic review for sophisticated attacks), Meta Analysis (cross-references and confidence scoring), and VirusTotal (malware scanning for binaries).",
                },
                {
                  id: "item-3",
                  question: "Is my uploaded file stored?",
                  answer:
                    "No. Uploaded files are stored temporarily during scanning and deleted immediately after the scan completes. We only retain scan results and a file hash for duplicate detection — never the original file.",
                },
                {
                  id: "item-4",
                  question: "What do the trust labels mean?",
                  answer:
                    "Safe (green) = no issues found. Caution (yellow) = medium-severity concerns. Unsafe (red) = high or critical threats detected. Dangerous (dark red) = multiple critical threats. Inconclusive (gray) = analysis was partial or low-confidence.",
                },
                {
                  id: "item-5",
                  question: "Do credits expire?",
                  answer:
                    "No. Credits never expire and are tied to your account. Every account also gets 1 free scan per rolling 30 days. Failed or invalid scans never consume a credit.",
                },
              ].map((item) => (
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
            Don&apos;t install untrusted skills
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            13.4% of published skills contain critical security issues. Scan
            yours before it&apos;s too late.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <a href="#top">
                Scan a Skill
                <ArrowRight className="ml-1 size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
