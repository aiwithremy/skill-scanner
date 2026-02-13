import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Parse and normalize GitHub URL
    const cleaned = url.replace(/^https?:\/\//, "");
    const match = cleaned.match(
      /^github\.com\/([\w.-]+)\/([\w.-]+)(?:\/tree\/[\w.-]+)?(?:\/(.+))?$/
    );
    if (!match) {
      return NextResponse.json(
        {
          error:
            "We couldn't access this repository. Make sure the URL is correct and the repository is public.",
        },
        { status: 400 }
      );
    }

    const [, owner, repo, path] = match;

    // Fetch repository contents via GitHub API
    const apiUrl = path
      ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
      : `https://api.github.com/repos/${owner}/${repo}/zipball`;

    // Download as ZIP
    const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball${path ? `/${path}` : ""}`;
    const zipResponse = await fetch(zipUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "SkillScanner/1.0",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!zipResponse.ok) {
      if (zipResponse.status === 404) {
        return NextResponse.json(
          {
            error:
              "We couldn't access this repository. Make sure the URL is correct and the repository is public.",
          },
          { status: 404 }
        );
      }
      if (zipResponse.status === 403) {
        return NextResponse.json(
          {
            error:
              "We're temporarily unable to fetch GitHub repositories. Please try uploading the skill as a ZIP file instead.",
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch repository." },
        { status: 502 }
      );
    }

    const zipBuffer = Buffer.from(await zipResponse.arrayBuffer());
    const fileHash = crypto.createHash("sha256").update(zipBuffer).digest("hex");

    // Check for duplicate if authenticated
    if (user) {
      const adminClient = createAdminClient();
      const { data: existingScan } = await adminClient
        .from("scans")
        .select("id, trust_label, created_at")
        .eq("user_id", user.id)
        .eq("file_hash", fileHash)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (existingScan) {
        return NextResponse.json({
          duplicate: true,
          existing_scan: existingScan,
          message: `You've already scanned this skill on ${new Date(existingScan.created_at).toLocaleDateString()}.`,
        });
      }
    }

    // Proxy ZIP to scanner backend
    const scannerUrl = process.env.SCANNER_API_URL;
    if (!scannerUrl) {
      return NextResponse.json(
        {
          error:
            "Our scanning engine is temporarily unavailable. Please try again in a few minutes.",
        },
        { status: 503 }
      );
    }

    const scanFormData = new FormData();
    scanFormData.append(
      "file",
      new Blob([zipBuffer]),
      `${owner}-${repo}.zip`
    );

    const scanParams = new URLSearchParams({
      use_llm: "true",
      llm_provider: "anthropic",
      use_behavioral: "true",
    });

    const scanResponse = await fetch(
      `${scannerUrl}/scan-upload?${scanParams}`,
      {
        method: "POST",
        headers: { "X-API-Key": process.env.SCANNER_API_KEY || "" },
        body: scanFormData,
        signal: AbortSignal.timeout(120000),
      }
    );

    if (!scanResponse.ok) {
      return NextResponse.json(
        {
          error:
            "Our scanning engine is temporarily unavailable. Please try again in a few minutes.",
        },
        { status: 503 }
      );
    }

    const scanResults = await scanResponse.json();
    const findings = scanResults.findings || [];

    // Compute findings summary by severity
    const findingsSummary = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    for (const f of findings) {
      const sev = (f.severity || "").toLowerCase();
      if (sev in findingsSummary)
        findingsSummary[sev as keyof typeof findingsSummary]++;
    }

    // Derive trust label
    let trustLabel = "safe";
    if (findingsSummary.critical >= 2) trustLabel = "dangerous";
    else if (findingsSummary.critical >= 1 || findingsSummary.high >= 1)
      trustLabel = "unsafe";
    else if (findingsSummary.medium >= 1) trustLabel = "caution";

    // Collect unique analyzer names
    const analyzersUsed = [
      ...new Set(findings.map((f: Record<string, unknown>) => f.analyzer)),
    ].filter(Boolean);

    const adminClient = createAdminClient();
    const { data: scan, error: insertError } = await adminClient
      .from("scans")
      .insert({
        user_id: user?.id || null,
        skill_name:
          scanResults.skill_name || path?.split("/").pop() || repo,
        source_type: "github",
        source_url: `https://github.com/${owner}/${repo}${path ? `/tree/main/${path}` : ""}`,
        file_hash: fileHash,
        trust_label: trustLabel,
        max_severity: scanResults.max_severity || "SAFE",
        findings_count: findings.length,
        findings_summary: findingsSummary,
        full_results: scanResults,
        analyzers_used: analyzersUsed,
        scan_duration_ms: Math.round((scanResults.scan_duration_seconds || 0) * 1000),
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save scan results." },
        { status: 500 }
      );
    }

    // Insert individual findings
    if (scanResults.findings?.length > 0) {
      const findings = scanResults.findings.map(
        (f: Record<string, unknown>) => ({
          scan_id: scan.id,
          rule_id: f.rule_id || "unknown",
          category: f.category || "general",
          severity: f.severity || "INFO",
          title: f.title || "Finding",
          description: f.description,
          file_path: f.file_path,
          line_number: f.line_number,
          snippet: f.snippet,
          remediation: f.remediation,
          analyzer: f.analyzer || "unknown",
          confidence: f.confidence,
          exploitability: f.exploitability,
          impact: f.impact,
        })
      );
      await adminClient.from("scan_findings").insert(findings);
    }

    return NextResponse.json({
      scan_id: scan.id,
      status: "complete",
      trust_label: trustLabel,
    });
  } catch (error) {
    console.error("GitHub scan error:", error);
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return NextResponse.json(
        {
          error:
            "The scan timed out. This can happen with very large skills. Please try again.",
        },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
