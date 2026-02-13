"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDecorator } from "@/components/card-decorator";
import {
  type TrustLabel,
  trustLabelConfig,
} from "@/lib/trust-labels";
import {
  Shield,
  ShieldAlert,
  ShieldX,
  ShieldOff,
  ShieldQuestion,
  ChevronDown,
  ChevronUp,
  Share2,
  ArrowLeft,
  Clock,
  FileCode2,
  AlertTriangle,
  AlertCircle,
  Info,
  Bug,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types matching the API response
// ---------------------------------------------------------------------------

type Severity = "critical" | "high" | "medium" | "low" | "info";

interface Finding {
  id: string;
  rule_id: string;
  category: string;
  severity: Severity;
  title: string;
  description: string;
  file_path: string;
  line_number: number;
  snippet: string;
  remediation: string;
  analyzer: string;
  confidence: number;
}

interface ScanResult {
  id: string;
  skill_name: string;
  trust_label: TrustLabel;
  source_type: string;
  source_url: string | null;
  findings_count: number;
  findings_summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  scan_duration_ms: number;
  created_at: string;
  is_public: boolean;
  user_id: string;
  findings: Finding[];
}

// ---------------------------------------------------------------------------
// Helper maps
// ---------------------------------------------------------------------------

const trustLabelIcons: Record<TrustLabel, typeof Shield> = {
  safe: Shield,
  caution: ShieldAlert,
  unsafe: ShieldX,
  dangerous: ShieldOff,
  inconclusive: ShieldQuestion,
};

const severityOrder: Severity[] = ["critical", "high", "medium", "low", "info"];

const severityConfig: Record<
  Severity,
  { label: string; icon: typeof AlertTriangle; borderClass: string }
> = {
  critical: {
    label: "Critical",
    icon: ShieldOff,
    borderClass: "border-l-trust-dangerous",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    borderClass: "border-l-trust-unsafe",
  },
  medium: {
    label: "Medium",
    icon: AlertCircle,
    borderClass: "border-l-trust-caution",
  },
  low: {
    label: "Low",
    icon: Info,
    borderClass: "border-l-trust-inconclusive",
  },
  info: {
    label: "Info",
    icon: Bug,
    borderClass: "border-l-border",
  },
};

const severityBadgeStyle: Record<Severity, string> = {
  critical: "bg-trust-dangerous/10 text-trust-dangerous border-trust-dangerous/20",
  high: "bg-trust-unsafe/10 text-trust-unsafe border-trust-unsafe/20",
  medium: "bg-trust-caution/10 text-trust-caution border-trust-caution/20",
  low: "bg-trust-inconclusive/10 text-trust-inconclusive border-trust-inconclusive/20",
  info: "bg-muted text-muted-foreground border-border",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScanResultPage() {
  const { id } = useParams<{ id: string }>();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharingLoading, setSharingLoading] = useState(false);

  // Fetch scan data on mount
  useEffect(() => {
    async function fetchScan() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/scan/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Scan not found.");
          } else {
            setError("Failed to load scan results.");
          }
          return;
        }
        const data: ScanResult = await res.json();
        setScan(data);
      } catch {
        setError("Failed to load scan results.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchScan();
    }
  }, [id]);

  const handleShareToggle = useCallback(async () => {
    if (!scan) return;
    setSharingLoading(true);
    try {
      const res = await fetch(`/api/scan/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: !scan.is_public }),
      });
      if (res.ok) {
        setScan((prev) => prev ? { ...prev, is_public: !prev.is_public } : prev);
      }
    } catch {
      // Silently fail -- user can retry
    } finally {
      setSharingLoading(false);
    }
  }, [scan, id]);

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to scanner
        </Link>
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading scan results...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !scan) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to scanner
        </Link>
        <Card className="relative rounded-none shadow-zinc-950/5">
          <CardDecorator />
          <CardContent className="flex flex-col items-center py-16 text-center">
            <ShieldQuestion className="size-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold">
              {error || "Scan not found"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              This scan may not exist, may have been deleted, or you may not have
              permission to view it.
            </p>
            <Button variant="outline" asChild className="mt-6 gap-2">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Scan a Skill
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Derived data
  const config = trustLabelConfig[scan.trust_label];
  const TrustIcon = trustLabelIcons[scan.trust_label];

  const summary = scan.findings_summary || {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  const totalFindings = Object.values(summary).reduce((a, b) => a + b, 0);

  const findingsBySeverity = severityOrder
    .map((severity) => ({
      severity,
      findings: scan.findings.filter((f) => f.severity === severity),
    }))
    .filter((group) => group.findings.length > 0);

  const durationSeconds = scan.scan_duration_ms
    ? (scan.scan_duration_ms / 1000).toFixed(1)
    : null;

  const formattedDate = new Date(scan.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to scanner
      </Link>

      {/* Trust Label Hero */}
      <Card className="relative rounded-none shadow-zinc-950/5">
        <CardDecorator />
        <CardContent className="flex flex-col items-center py-10 text-center">
          {/* Trust icon + badge */}
          <div
            className="mb-4 flex size-16 items-center justify-center rounded-full"
            style={{ backgroundColor: `color-mix(in srgb, var(--${scan.trust_label === "safe" ? "trust-safe" : scan.trust_label === "caution" ? "trust-caution" : scan.trust_label === "unsafe" ? "trust-unsafe" : scan.trust_label === "dangerous" ? "trust-dangerous" : "trust-inconclusive"}) 12%, transparent)` }}
          >
            <TrustIcon
              className={`size-8 ${config.colorClass}`}
              strokeWidth={1.5}
            />
          </div>

          <Badge
            className={`mb-3 rounded-md px-4 py-1.5 text-lg font-semibold ${config.bgClass} text-white border-0`}
          >
            {config.label}
          </Badge>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {config.description}
          </p>

          {/* Skill meta */}
          <hr className="my-6 w-full max-w-sm border-dashed" />

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="font-mono font-medium text-foreground">
              {scan.skill_name}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formattedDate}
            </span>
            {scan.findings_count != null && (
              <span className="flex items-center gap-1.5">
                <FileCode2 className="size-3.5" />
                {scan.findings_count} findings
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <Card className="relative rounded-none shadow-zinc-950/5 col-span-2 sm:col-span-4 lg:col-span-2">
          <CardDecorator />
          <CardContent className="flex flex-col items-center justify-center py-5">
            <span className="text-3xl font-semibold">{totalFindings}</span>
            <span className="mt-1 text-xs text-muted-foreground">
              Total Findings
            </span>
          </CardContent>
        </Card>
        {severityOrder.map((severity) => {
          const count = summary[severity];
          const sConfig = severityConfig[severity];
          return (
            <Card
              key={severity}
              className="relative rounded-none shadow-zinc-950/5"
            >
              <CardContent className="flex flex-col items-center justify-center py-5">
                <span className="text-2xl font-semibold">{count}</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {sConfig.label}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analyzers run */}
      <div className="mt-6">
        <Card className="relative rounded-none shadow-zinc-950/5">
          <CardDecorator />
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {durationSeconds
                  ? `Scan completed in ${durationSeconds}s`
                  : "Scan completed"}
              </span>
              <div className="flex gap-2">
                {[
                  "Static",
                  "Behavioral",
                  "LLM",
                  "Meta",
                  "VirusTotal",
                ].map((name) => (
                  <Badge
                    key={name}
                    variant="outline"
                    className="rounded-md text-xs"
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Full Report Toggle */}
      {scan.findings.length > 0 && (
        <div className="mt-8 flex items-center justify-center">
          <Button
            variant="outline"
            onClick={() => setShowFullReport(!showFullReport)}
            className="gap-2"
          >
            {showFullReport ? (
              <>
                Hide Full Report
                <ChevronUp className="size-4" />
              </>
            ) : (
              <>
                View Full Report
                <ChevronDown className="size-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Full Report -- Findings by Severity */}
      {showFullReport && (
        <div className="mt-8 space-y-8">
          {findingsBySeverity.map(({ severity, findings }) => {
            const sConfig = severityConfig[severity];
            const SeverityIcon = sConfig.icon;

            return (
              <div key={severity}>
                <div className="mb-3 flex items-center gap-2">
                  <SeverityIcon className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {sConfig.label} ({findings.length})
                  </h3>
                </div>

                <Accordion type="multiple" className="space-y-3">
                  {findings.map((finding) => (
                    <AccordionItem
                      key={finding.id}
                      value={finding.id}
                      className="border-0"
                    >
                      <Card
                        className={`relative rounded-none shadow-zinc-950/5 border-l-4 ${sConfig.borderClass}`}
                      >
                        <CardDecorator />
                        <CardHeader className="p-0">
                          <AccordionTrigger className="cursor-pointer px-6 py-4 hover:no-underline">
                            <div className="flex flex-1 items-start gap-3 text-left">
                              <div className="flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-sm">
                                    {finding.title}
                                  </span>
                                  <Badge
                                    className={`rounded-md text-[10px] font-medium ${severityBadgeStyle[finding.severity]}`}
                                  >
                                    {sConfig.label}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span>{finding.category}</span>
                                  {finding.file_path && (
                                    <span className="font-mono">
                                      {finding.file_path}
                                      {finding.line_number ? `:${finding.line_number}` : ""}
                                    </span>
                                  )}
                                  <span>{finding.analyzer}</span>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                        </CardHeader>

                        <AccordionContent>
                          <CardContent className="space-y-4 pt-0">
                            <hr className="border-dashed" />

                            {/* Description */}
                            <div>
                              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Description
                              </h4>
                              <p className="text-sm leading-relaxed">
                                {finding.description}
                              </p>
                            </div>

                            {/* Code snippet */}
                            {finding.snippet && (
                              <div>
                                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Code
                                </h4>
                                <div className="relative">
                                  <pre className="overflow-x-auto rounded-md border border-dashed bg-muted/50 p-4 font-mono text-xs leading-relaxed">
                                    <code>{finding.snippet}</code>
                                  </pre>
                                  {finding.file_path && (
                                    <span className="absolute right-2 top-2 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                                      {finding.file_path}
                                      {finding.line_number ? `:${finding.line_number}` : ""}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Remediation */}
                            {finding.remediation && (
                              <div>
                                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Remediation
                                </h4>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                  {finding.remediation}
                                </p>
                              </div>
                            )}

                            {/* Confidence */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {finding.confidence != null && (
                                <>
                                  <span>
                                    Confidence:{" "}
                                    {Math.round(finding.confidence * 100)}%
                                  </span>
                                  <span>&middot;</span>
                                </>
                              )}
                              <span>Analyzer: {finding.analyzer}</span>
                            </div>
                          </CardContent>
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={handleShareToggle}
          disabled={sharingLoading}
          className="gap-2"
        >
          <Share2 className="size-4" />
          {scan.is_public ? "Make Private" : "Make Public"}
        </Button>
        <Button variant="outline" onClick={handleCopyLink} className="gap-2">
          {copied ? (
            <>
              <Check className="size-4" />
              Link Copied
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copy Link
            </>
          )}
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Scan Another Skill
          </Link>
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 border-t border-dashed pt-6">
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          This scan report is generated by automated security analyzers and
          should not be treated as a definitive security audit. False positives
          and false negatives are possible. Always perform manual review for
          critical deployments. Skill Scanner is not liable for any damages
          resulting from the use or installation of scanned skills.
        </p>
      </div>
    </div>
  );
}
