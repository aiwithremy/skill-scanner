import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-dashed">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6 px-6 py-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Skill Scanner
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
