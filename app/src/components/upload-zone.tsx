"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileArchive, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelected?: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onFileSelected, disabled }: UploadZoneProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = disabled || isScanning;

  const validateFile = useCallback((file: File): string | null => {
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) return "This file exceeds the 25MB upload limit.";

    const validExtensions = [".zip", ".skill"];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!validExtensions.includes(ext)) {
      return "Please upload a .zip or .skill file.";
    }

    return null;
  }, []);

  const submitFile = useCallback(
    async (file: File) => {
      setIsScanning(true);
      setSelectedFile(file);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/scan/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "An unexpected error occurred. Please try again.");
          setIsScanning(false);
          setSelectedFile(null);
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
        setSelectedFile(null);
      } catch {
        setError("Failed to connect to the server. Please check your connection and try again.");
        setIsScanning(false);
        setSelectedFile(null);
      }
    },
    [router]
  );

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      onFileSelected?.(file);
      submitFile(file);
    },
    [onFileSelected, validateFile, submitFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (isDisabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, isDisabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isDisabled) setIsDragging(true);
    },
    [isDisabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (isDisabled) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip,.skill";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile, isDisabled]);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        className={cn(
          "group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-foreground/40 bg-muted/50"
            : "border-border hover:border-foreground/30 hover:bg-muted/30",
          isDisabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full border bg-background p-3 shadow-sm">
            {isScanning ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : isDragging ? (
              <FileArchive className="size-6 text-muted-foreground" />
            ) : (
              <Upload className="size-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {isScanning
                ? `Scanning ${selectedFile?.name ?? "file"}...`
                : isDragging
                  ? "Drop your skill file here"
                  : "Drag & drop a skill file"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isScanning
                ? "This may take up to two minutes"
                : ".zip or .skill files up to 25MB"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
