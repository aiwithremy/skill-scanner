import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Skill Scanner",
  description: "View your scan history, manage credits, and purchase scan packs.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Add auth check — redirect to /auth/login if not authenticated
  return <>{children}</>;
}
