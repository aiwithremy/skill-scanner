"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  credits_balance: number;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let resolved = false;
    const supabase = createClient();

    function resolve() {
      if (!resolved) {
        resolved = true;
        setLoading(false);
      }
    }

    async function fetchProfile(userId: string) {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("display_name, avatar_url, credits_balance")
          .eq("id", userId)
          .single();
        if (data) setProfile(data);
      } catch {
        // Profile may not exist yet
      }
    }

    // getSession reads from cookies without a network round-trip
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        resolve(); // Show UI immediately, fetch profile in background
        await fetchProfile(session.user.id);
      } else {
        resolve();
      }
    }).catch(() => {
      resolve();
    });

    // Listen for future auth changes (sign in/out after initial load)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        resolve();
        await fetchProfile(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
      resolve();
    });

    // Safety timeout — never stay stuck on loading
    const timeout = setTimeout(resolve, 3000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
