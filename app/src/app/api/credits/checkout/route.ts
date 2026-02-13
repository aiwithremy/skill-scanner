import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

const CREDIT_PACKS: Record<
  string,
  { credits: number; priceInCents: number; name: string }
> = {
  single: { credits: 1, priceInCents: 200, name: "Single Scan" },
  starter: { credits: 5, priceInCents: 500, name: "Starter Pack" },
  pro: { credits: 25, priceInCents: 1500, name: "Pro Pack" },
  team: { credits: 100, priceInCents: 4000, name: "Team Pack" },
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pack } = await request.json();
  const creditPack = CREDIT_PACKS[pack];

  if (!creditPack) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
  }

  const adminClient = createAdminClient();

  // Get or create Stripe customer
  const { data: profile } = await adminClient
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await adminClient
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  // Create checkout session
  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Skill Scanner — ${creditPack.name}`,
            description: `${creditPack.credits} scan credit${creditPack.credits > 1 ? "s" : ""}`,
          },
          unit_amount: creditPack.priceInCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
      pack,
      credits: creditPack.credits.toString(),
    },
    success_url: `${request.nextUrl.origin}/dashboard/credits?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.nextUrl.origin}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
