"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardDecorator } from "@/components/card-decorator";
import {
  type TrustLabel,
  trustLabelConfig,
} from "@/lib/trust-labels";
import { createClient } from "@/lib/supabase/client";
import {
  History,
  CreditCard,
  ExternalLink,
  Trash2,
  Upload,
  Github,
  Shield,
  Coins,
  ArrowRight,
  Gift,
  Clock,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Scan {
  id: string;
  skill_name: string;
  trust_label: TrustLabel;
  created_at: string;
  source_type: "upload" | "github";
  findings_count: number;
}

interface Transaction {
  id: string;
  created_at: string;
  type: "purchase" | "deduction" | "free";
  description: string;
  amount: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TrustLabelBadge({ label }: { label: TrustLabel }) {
  const config = trustLabelConfig[label];
  return (
    <Badge
      variant="outline"
      className="border-transparent font-medium text-white"
      style={{ backgroundColor: `var(--trust-${label})` }}
    >
      {config.label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ScanHistoryEmpty() {
  return (
    <Card className="relative rounded-none border-dashed shadow-none">
      <CardDecorator />
      <CardContent className="flex flex-col items-center py-16 text-center">
        <Shield className="mb-4 size-10 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No scans yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Upload a skill file or paste a GitHub URL to run your first security
          scan.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">
            Scan a Skill
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ScanHistoryTable({ scans }: { scans: Scan[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dashed text-left text-muted-foreground">
            <th className="pb-3 pr-4 font-medium">Skill</th>
            <th className="pb-3 pr-4 font-medium">Trust Label</th>
            <th className="hidden pb-3 pr-4 font-medium sm:table-cell">
              Source
            </th>
            <th className="hidden pb-3 pr-4 font-medium md:table-cell">
              Findings
            </th>
            <th className="pb-3 pr-4 font-medium">Date</th>
            <th className="pb-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr
              key={scan.id}
              className="group border-b border-dashed last:border-0"
            >
              <td className="py-3 pr-4">
                <Link
                  href={`/scan/${scan.id}`}
                  className="flex items-center gap-1.5 font-medium hover:underline"
                >
                  {scan.skill_name}
                  <ExternalLink className="hidden size-3 text-muted-foreground group-hover:inline-block" />
                </Link>
              </td>
              <td className="py-3 pr-4">
                <TrustLabelBadge label={scan.trust_label} />
              </td>
              <td className="hidden py-3 pr-4 sm:table-cell">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  {scan.source_type === "github" ? (
                    <Github className="size-3.5" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}
                  {scan.source_type === "github" ? "GitHub" : "Upload"}
                </span>
              </td>
              <td className="hidden py-3 pr-4 md:table-cell">
                <span className="text-muted-foreground">
                  {scan.findings_count}
                </span>
              </td>
              <td className="py-3 pr-4 text-muted-foreground">
                {formatDate(scan.created_at)}
              </td>
              <td className="py-3">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => {
                    // TODO: Delete scan via API
                    console.log("Delete scan:", scan.id);
                  }}
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Delete scan</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CreditsEmpty() {
  return (
    <Card className="relative rounded-none border-dashed shadow-none">
      <CardDecorator />
      <CardContent className="flex flex-col items-center py-16 text-center">
        <Coins className="mb-4 size-10 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No credits yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          You have no credits and your free scan has been used. Purchase a credit
          pack to continue scanning.
        </p>
        <Button asChild className="mt-6">
          <Link href="/pricing">
            View Pricing
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function FreeScanUsedEmpty() {
  return (
    <Card className="relative rounded-none border-dashed shadow-none">
      <CardDecorator />
      <CardContent className="flex flex-col items-center py-16 text-center">
        <Clock className="mb-4 size-10 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Free scan used</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          You&apos;ve used your free scan this month. Purchase credits or wait
          until your next free scan is available.
        </p>
        <div className="mt-4 flex gap-3">
          <Button asChild>
            <Link href="/pricing">Buy Credits</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const CREDIT_PACKS = [
  { name: "Single", pack: "single" as const, scans: 1, price: "$2" },
  { name: "Starter", pack: "starter" as const, scans: 5, price: "$5" },
  { name: "Pro", pack: "pro" as const, scans: 25, price: "$15" },
  { name: "Team", pack: "team" as const, scans: 100, price: "$40" },
];

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function DashboardSkeleton() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Determine if the free scan has been used within the last 30 days. */
function isFreeScanUsed(freeScanLastUsed: string | null): boolean {
  if (!freeScanLastUsed) return false;
  const lastUsed = new Date(freeScanLastUsed);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return lastUsed > thirtyDaysAgo;
}

/** Compute the next free scan date (30 days after last used). */
function getNextFreeScanDate(freeScanLastUsed: string): string {
  const lastUsed = new Date(freeScanLastUsed);
  const next = new Date(lastUsed);
  next.setDate(next.getDate() + 30);
  return next.toISOString();
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<Scan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const [freeScanLastUsed, setFreeScanLastUsed] = useState<string | null>(null);
  const [purchasingPack, setPurchasingPack] = useState<string | null>(null);

  const freeScanUsed = isFreeScanUsed(freeScanLastUsed);
  const nextFreeScan = freeScanLastUsed
    ? getNextFreeScanDate(freeScanLastUsed)
    : null;

  const fetchData = useCallback(async () => {
    const supabase = createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.replace("/auth/login");
      return;
    }

    // Fetch all data in parallel
    const [scansResult, profileResult, transactionsResult] = await Promise.all([
      supabase
        .from("scans")
        .select("id, skill_name, trust_label, source_type, findings_count, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("credits_balance, free_scan_last_used")
        .eq("id", user.id)
        .single(),
      supabase
        .from("credit_transactions")
        .select("id, type, amount, description, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    setScans((scansResult.data as Scan[]) ?? []);
    setCreditBalance(profileResult.data?.credits_balance ?? 0);
    setFreeScanLastUsed(profileResult.data?.free_scan_last_used ?? null);
    setTransactions((transactionsResult.data as Transaction[]) ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------------------------------------------------------------------------
  // Purchase handler
  // ---------------------------------------------------------------------------

  async function handlePurchase(pack: string) {
    setPurchasingPack(pack);
    try {
      const res = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack }),
      });

      if (!res.ok) {
        console.error("Checkout failed:", await res.text());
        return;
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setPurchasingPack(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (loading) return <DashboardSkeleton />;

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const hasScans = scans.length > 0;
  const hasCreditsOrFreeScan = creditBalance > 0 || !freeScanUsed;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your scans and credits.
          </p>
        </div>

        <Tabs defaultValue="history">
          <TabsList variant="line" className="mb-8">
            <TabsTrigger value="history" className="gap-2">
              <History className="size-4" />
              Scan History
            </TabsTrigger>
            <TabsTrigger value="credits" className="gap-2">
              <CreditCard className="size-4" />
              Credits
            </TabsTrigger>
          </TabsList>

          {/* ----- Scan History Tab ----- */}
          <TabsContent value="history">
            {hasScans ? <ScanHistoryTable scans={scans} /> : <ScanHistoryEmpty />}
          </TabsContent>

          {/* ----- Credits Tab ----- */}
          <TabsContent value="credits">
            <div className="space-y-8">
              {/* Balance + Free Scan Status */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="relative rounded-none shadow-zinc-950/5">
                  <CardDecorator />
                  <CardHeader>
                    <CardDescription>Credit Balance</CardDescription>
                    <CardTitle className="text-3xl">{creditBalance}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {creditBalance === 1
                        ? "1 scan remaining"
                        : `${creditBalance} scans remaining`}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative rounded-none shadow-zinc-950/5">
                  <CardDecorator />
                  <CardHeader>
                    <CardDescription>Free Scan</CardDescription>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {freeScanUsed && nextFreeScan ? (
                        <>
                          <Clock className="size-4 text-muted-foreground" />
                          Next free scan: {formatDate(nextFreeScan)}
                        </>
                      ) : (
                        <>
                          <Gift className="size-4" style={{ color: "var(--trust-safe)" }} />
                          Free scan available
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {freeScanUsed
                        ? "1 free scan resets every 30 days."
                        : "You have 1 free scan available this month."}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Buy */}
              <div>
                <h2 className="mb-4 text-lg font-semibold">Buy Credits</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {CREDIT_PACKS.map((creditPack) => (
                    <Button
                      key={creditPack.name}
                      variant="outline"
                      className="h-auto flex-col gap-1 py-4"
                      disabled={purchasingPack !== null}
                      onClick={() => handlePurchase(creditPack.pack)}
                    >
                      {purchasingPack === creditPack.pack ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          <span className="text-base font-semibold">
                            {creditPack.price}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {creditPack.scans} {creditPack.scans === 1 ? "credit" : "credits"}
                          </span>
                        </>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Purchase History */}
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  Transaction History
                </h2>
                {transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-dashed text-left text-muted-foreground">
                          <th className="pb-3 pr-4 font-medium">Date</th>
                          <th className="pb-3 pr-4 font-medium">Description</th>
                          <th className="pb-3 font-medium text-right">
                            Credits
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr
                            key={tx.id}
                            className="border-b border-dashed last:border-0"
                          >
                            <td className="py-3 pr-4 text-muted-foreground">
                              {formatDate(tx.created_at)}
                            </td>
                            <td className="py-3 pr-4">{tx.description}</td>
                            <td className="py-3 text-right font-mono">
                              {tx.type === "purchase" ? (
                                <span style={{ color: "var(--trust-safe)" }}>
                                  +{tx.amount}
                                </span>
                              ) : tx.type === "deduction" ? (
                                <span className="text-muted-foreground">
                                  {tx.amount}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Free
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No transactions yet.
                  </p>
                )}
              </div>

              {/* Empty state — shown when no credits AND no free scan */}
              {!hasCreditsOrFreeScan && <CreditsEmpty />}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
