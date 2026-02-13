import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const credits = parseInt(session.metadata?.credits || "0", 10);
    const pack = session.metadata?.pack;

    if (!userId || !credits) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Get current balance
    const { data: profile } = await adminClient
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .single();

    if (!profile) {
      console.error("Profile not found for user:", userId);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Add credits
    await adminClient
      .from("profiles")
      .update({ credits_balance: profile.credits_balance + credits })
      .eq("id", userId);

    // Log transaction
    await adminClient.from("credit_transactions").insert({
      user_id: userId,
      type: "purchase",
      amount: credits,
      stripe_session_id: session.id,
      description: `Purchased ${pack} pack (${credits} credits)`,
    });
  }

  return NextResponse.json({ received: true });
}
