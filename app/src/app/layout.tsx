import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Scanner — Scan AI Agent Skills for Security Threats",
  description:
    "Upload a skill file or paste a GitHub URL. Get a comprehensive security analysis with trust ratings and detailed findings in seconds.",
  openGraph: {
    title: "Skill Scanner — Scan AI Agent Skills for Security Threats",
    description:
      "Upload a skill file or paste a GitHub URL. Get a comprehensive security analysis with trust ratings and detailed findings in seconds.",
    url: "https://skillscanner.xyz",
    siteName: "Skill Scanner",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Scanner — Scan AI Agent Skills for Security Threats",
    description:
      "Upload a skill file or paste a GitHub URL. Get a comprehensive security analysis with trust ratings and detailed findings in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
