"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Coins, LayoutDashboard, LogOut } from "lucide-react";

interface UserMenuProps {
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
  creditsBalance: number;
}

export function UserMenu({
  displayName,
  avatarUrl,
  email,
  creditsBalance,
}: UserMenuProps) {
  const router = useRouter();

  const name = displayName || email.split("@")[0];
  const initials = name.slice(0, 2).toUpperCase();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="gap-1 font-mono text-xs">
        <Coins className="size-3" />
        {creditsBalance}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 rounded-full">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {initials}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/pricing">
              <Coins className="size-4" />
              Buy Credits
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
