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
  /** Temporary debug info — remove once auth is confirmed working */
  _debug?: string;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState("mount");

  useEffect(() => {
    let resolved = false;

    function resolve() {
      if (!resolved) {
        resolved = true;
        setLoading(false);
      }
    }

    async function fetchProfile(supabase: ReturnType<typeof createClient>, userId: string) {
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

    try {
      setDebug("creating client");
      const supabase = createClient();
      setDebug("client created");

      // Primary: getSession reads from cookies, no network call
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        setDebug(`session: ${session ? session.user?.email : "null"}`);
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(supabase, session.user.id);
        }
        resolve();
      }).catch((err) => {
        setDebug(`session error: ${err?.message}`);
        resolve();
      });

      // Also listen for future changes (sign in/out after initial load)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setDebug(`auth event: ${event}`);
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(supabase, session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
        resolve();
      });

      // Safety timeout — never stay stuck on loading
      const timeout = setTimeout(() => {
        setDebug("timeout (3s)");
        resolve();
      }, 3000);

      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    } catch (err) {
      setDebug(`init error: ${err instanceof Error ? err.message : String(err)}`);
      resolve();
    }
  }, []);

  return { user, profile, loading, _debug: debug };
}
