import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Use admin client to bypass RLS for access-control checks
  const { data: scan, error } = await adminClient
    .from("scans")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  // Access control
  const isOwner = user && scan.user_id === user.id;
  const isUnclaimed = scan.user_id === null;
  const isPublic = scan.is_public;

  // Unclaimed scan + anonymous viewer → prompt sign-in
  if (isUnclaimed && !user) {
    return NextResponse.json(
      {
        requires_auth: true,
        trust_label: scan.trust_label,
        skill_name: scan.skill_name,
        findings_count: scan.findings_count,
        scan_id: scan.id,
      },
      { status: 403 }
    );
  }

  // Not owner, not public, and not unclaimed-for-this-user
  if (!isOwner && !isPublic && !isUnclaimed) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  // Fetch findings
  const { data: findings } = await adminClient
    .from("scan_findings")
    .select("*")
    .eq("scan_id", id)
    .order("severity", { ascending: true });

  return NextResponse.json({
    ...scan,
    findings: findings || [],
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const allowedFields = ["is_public"];
  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) updates[key] = body[key];
  }

  const { error } = await supabase
    .from("scans")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update scan" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("scans")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete scan" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
