"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

interface GitHubUrlInputProps {
  onSubmit?: (url: string) => void;
  disabled?: boolean;
}

export function GitHubUrlInput({ onSubmit, disabled }: GitHubUrlInputProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = disabled || isScanning;

  const validateUrl = (input: string): string | null => {
    const cleaned = input.replace(/^https?:\/\//, "");
    const githubPattern = /^github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/;
    if (!githubPattern.test(cleaned)) {
      return "Please enter a valid GitHub repository URL (e.g., github.com/user/repo)";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled || !url.trim()) return;

    const validationError = validateUrl(url.trim());
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsScanning(true);
    onSubmit?.(url.trim());

    try {
      const response = await fetch("/api/scan/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An unexpected error occurred. Please try again.");
        setIsScanning(false);
        return;
      }

      // Handle duplicate scan — redirect to the existing result
      if (data.duplicate && data.existing_scan?.id) {
        localStorage.setItem("pending_scan_id", data.existing_scan.id);
        router.push(`/scan/${data.existing_scan.id}/progress`);
        return;
      }

      // Successful scan
      if (data.scan_id) {
        localStorage.setItem("pending_scan_id", data.scan_id);
        router.push(`/scan/${data.scan_id}/progress`);
        return;
      }

      // Unexpected response shape
      setError("An unexpected error occurred. Please try again.");
      setIsScanning(false);
    } catch {
      setError("Failed to connect to the server. Please check your connection and try again.");
      setIsScanning(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Github className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="github.com/user/repo"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            disabled={isDisabled}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isDisabled || !url.trim()}>
          {isScanning ? (
            <>
              <Loader2 className="mr-1 size-4 animate-spin" />
              Scanning
            </>
          ) : (
            <>
              Scan
              <ArrowRight className="ml-1 size-4" />
            </>
          )}
        </Button>
      </form>

      {isScanning && (
        <p className="mt-3 text-xs text-muted-foreground">
          Fetching repository and scanning... This may take up to two minutes.
        </p>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
