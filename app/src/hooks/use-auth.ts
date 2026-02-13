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
    const supabase = createClient();

    async function fetchProfile(userId: string) {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("display_name, avatar_url, credits_balance")
          .eq("id", userId)
          .single();
        if (data) setProfile(data);
      } catch {
        // Profile may not exist yet — that's fine
      }
    }

    // Use onAuthStateChange as the single source of truth.
    // It fires INITIAL_SESSION synchronously with the cookie-based session,
    // avoiding the network round-trip that getUser() requires.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, loading };
}
