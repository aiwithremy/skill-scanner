import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { scan_id } = await request.json();
  if (!scan_id) {
    return NextResponse.json(
      { error: "No scan_id provided" },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  // Verify scan exists and is unclaimed
  const { data: scan, error: scanError } = await adminClient
    .from("scans")
    .select("id, user_id")
    .eq("id", scan_id)
    .single();

  if (scanError || !scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  if (scan.user_id !== null) {
    return NextResponse.json(
      { error: "Scan already claimed" },
      { status: 409 }
    );
  }

  // Claim the scan
  const { error: updateError } = await adminClient
    .from("scans")
    .update({ user_id: user.id })
    .eq("id", scan_id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to claim scan" },
      { status: 500 }
    );
  }

  // Determine credit type: free scan or paid
  const { data: profile } = await adminClient
    .from("profiles")
    .select("credits_balance, free_scan_last_used")
    .eq("id", user.id)
    .single();

  if (profile) {
    const now = new Date();
    const lastFreeScan = profile.free_scan_last_used
      ? new Date(profile.free_scan_last_used)
      : null;
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const freeEligible = !lastFreeScan || lastFreeScan < thirtyDaysAgo;

    if (freeEligible) {
      // Use free scan
      await adminClient
        .from("profiles")
        .update({ free_scan_last_used: now.toISOString() })
        .eq("id", user.id);

      await adminClient.from("credit_transactions").insert({
        user_id: user.id,
        type: "free_scan",
        amount: 0,
        scan_id: scan_id,
        description: "Free monthly scan",
      });
    } else if (profile.credits_balance > 0) {
      // Deduct paid credit
      await adminClient
        .from("profiles")
        .update({ credits_balance: profile.credits_balance - 1 })
        .eq("id", user.id);

      await adminClient.from("credit_transactions").insert({
        user_id: user.id,
        type: "scan_deduct",
        amount: -1,
        scan_id: scan_id,
        description: "Scan credit deduction",
      });
    }
    // If no credits and no free scan, results will be gated on frontend
  }

  return NextResponse.json({ success: true, scan_id });
}
