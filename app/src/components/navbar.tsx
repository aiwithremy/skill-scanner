"use client";

import Link from "next/link";
import { useState } from "react";
import { Coins, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, loading } = useAuth();

  const isAuthed = !loading && !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-pixel text-lg tracking-tight">
          Skill Scanner
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <ThemeToggle />
          {loading ? (
            <div className="h-8 w-16" />
          ) : isAuthed ? (
            <UserMenu
              displayName={profile?.display_name ?? user.user_metadata?.full_name ?? null}
              avatarUrl={profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null}
              email={user.email ?? ""}
              creditsBalance={profile?.credits_balance ?? 0}
            />
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {isAuthed && (
            <Badge variant="secondary" className="gap-1 font-mono text-xs">
              <Coins className="size-3" />
              {profile?.credits_balance ?? 0}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-dashed px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {isAuthed && (
              <>
                <div className="flex items-center gap-2 pb-2 border-b border-dashed">
                  {(profile?.avatar_url || user.user_metadata?.avatar_url) ? (
                    <img
                      src={profile?.avatar_url || user.user_metadata?.avatar_url}
                      alt=""
                      className="size-6 rounded-full"
                    />
                  ) : (
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {(
                        profile?.display_name ||
                        user.user_metadata?.full_name ||
                        user.email ||
                        "U"
                      )
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                  <span className="text-sm font-medium">
                    {profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            {isAuthed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  setMenuOpen(false);
                  window.location.href = "/";
                }}
              >
                Sign out
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
