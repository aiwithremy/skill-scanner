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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (25MB max)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "This file exceeds the 25MB upload limit." },
        { status: 400 }
      );
    }

    // Validate file extension
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (![".zip", ".skill"].includes(ext)) {
      return NextResponse.json(
        { error: "Please upload a .zip or .skill file." },
        { status: 400 }
      );
    }

    // Compute file hash for duplicate detection
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    // Check for duplicate scan if user is authenticated
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

    // Upload file to Supabase Storage temporarily
    const adminClient = createAdminClient();
    const storagePath = `scans/${crypto.randomUUID()}/${file.name}`;
    const { error: uploadError } = await adminClient.storage
      .from("scan-uploads")
      .upload(storagePath, fileBuffer, {
        contentType: file.type || "application/zip",
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file. Please try again." },
        { status: 500 }
      );
    }

    // Proxy to scanner backend
    const scannerUrl = process.env.SCANNER_API_URL;
    if (!scannerUrl) {
      // Clean up uploaded file
      await adminClient.storage.from("scan-uploads").remove([storagePath]);
      return NextResponse.json(
        { error: "Our scanning engine is temporarily unavailable. Please try again in a few minutes." },
        { status: 503 }
      );
    }

    const scanFormData = new FormData();
    scanFormData.append("file", new Blob([fileBuffer]), file.name);

    const scanParams = new URLSearchParams({
      use_llm: "true",
      llm_provider: "anthropic",
      use_behavioral: "true",
    });

    const scanResponse = await fetch(
      `${scannerUrl}/scan-upload?${scanParams}`,
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.SCANNER_API_KEY || "",
        },
        body: scanFormData,
        signal: AbortSignal.timeout(120000), // 120s timeout for LLM analysis
      }
    );

    // Clean up uploaded file immediately after scan
    await adminClient.storage.from("scan-uploads").remove([storagePath]);

    if (!scanResponse.ok) {
      return NextResponse.json(
        { error: "Our scanning engine is temporarily unavailable. Please try again in a few minutes." },
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

    // Derive trust label from findings
    let trustLabel = "safe";
    if (findingsSummary.critical >= 2) trustLabel = "dangerous";
    else if (findingsSummary.critical >= 1 || findingsSummary.high >= 1)
      trustLabel = "unsafe";
    else if (findingsSummary.medium >= 1) trustLabel = "caution";

    // Collect unique analyzer names
    const analyzersUsed = [
      ...new Set(findings.map((f: Record<string, unknown>) => f.analyzer)),
    ].filter(Boolean);

    // Store scan result in database
    const { data: scan, error: insertError } = await adminClient
      .from("scans")
      .insert({
        user_id: user?.id || null,
        skill_name: scanResults.skill_name || file.name.replace(/\.(zip|skill)$/, ""),
        source_type: "upload",
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

    const skillName = scanResults.skill_name || file.name.replace(/\.(zip|skill)$/, "");

    return NextResponse.json({
      scan_id: scan.id,
      status: "complete",
      trust_label: trustLabel,
      skill_name: skillName,
    });
  } catch (error) {
    console.error("Scan upload error:", error);
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "The scan timed out. This can happen with very large skills. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
