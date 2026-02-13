"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CardDecorator } from "@/components/card-decorator";
import {
  Check,
  CircleDashed,
  Loader2,
  Shield,
  FileCode2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StepStatus = "pending" | "running" | "complete";

interface AnalyzerStep {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
  duration: number | null;
}

// ---------------------------------------------------------------------------
// Mock animated progress -- simulates 5 analyzers completing sequentially
// ---------------------------------------------------------------------------

const INITIAL_STEPS: AnalyzerStep[] = [
  {
    id: "static",
    name: "Static Analysis",
    description: "Pattern matching across 58 security rules",
    status: "pending",
    duration: null,
  },
  {
    id: "behavioral",
    name: "Behavioral Analysis",
    description: "AST-based dataflow and exfiltration chain detection",
    status: "pending",
    duration: null,
  },
  {
    id: "llm",
    name: "LLM Analysis",
    description: "Semantic review for sophisticated attack patterns",
    status: "pending",
    duration: null,
  },
  {
    id: "meta",
    name: "Meta Analysis",
    description: "Cross-referencing findings and confidence scoring",
    status: "pending",
    duration: null,
  },
  {
    id: "virustotal",
    name: "VirusTotal",
    description: "Malware scanning for embedded binaries",
    status: "pending",
    duration: null,
  },
];

// Simulated durations in ms for each step
const STEP_DURATIONS = [1800, 2200, 3400, 1200, 2000];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScanProgressPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<AnalyzerStep[]>(INITIAL_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Mock data
  const skillName = "weather-assistant-skill";
  const fileCount = 23;

  const allComplete = steps.every((s) => s.status === "complete");

  // Elapsed timer
  useEffect(() => {
    if (allComplete) return;
    const interval = setInterval(() => {
      setElapsedMs((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, [allComplete]);

  // Step progression simulation
  const advanceStep = useCallback(() => {
    if (currentStep >= INITIAL_STEPS.length) return;

    // Mark current step as running
    setSteps((prev) =>
      prev.map((step, i) =>
        i === currentStep ? { ...step, status: "running" } : step
      )
    );

    const duration = STEP_DURATIONS[currentStep];

    // After the simulated duration, mark complete and advance
    const timer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((step, i) =>
          i === currentStep
            ? { ...step, status: "complete", duration: duration / 1000 }
            : step
        )
      );
      setCurrentStep((prev) => prev + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    if (currentStep >= INITIAL_STEPS.length) return;
    const cleanup = advanceStep();
    return cleanup;
  }, [currentStep, advanceStep]);

  // Redirect to results when complete (mock: uses a placeholder ID)
  useEffect(() => {
    if (!allComplete) return;
    const timer = setTimeout(() => {
      router.push("/scan/scan_abc123def456");
    }, 1500);
    return () => clearTimeout(timer);
  }, [allComplete, router]);

  const completedCount = steps.filter((s) => s.status === "complete").length;
  const progressPercent = (completedCount / steps.length) * 100;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      <Card className="relative w-full max-w-lg rounded-none shadow-zinc-950/5">
        <CardDecorator />
        <CardContent className="p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <Shield className="size-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h1 className="text-lg font-semibold">
              Scanning:{" "}
              <span className="font-mono">{skillName}</span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              <FileCode2 className="mr-1 inline size-3.5" />
              Analyzing {fileCount} files across 5 engines
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {completedCount} of {steps.length} analyzers
              </span>
              <span>{(elapsedMs / 1000).toFixed(1)}s</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-1">
            {steps.map((step, index) => (
              <div key={step.id}>
                <div className="flex items-center gap-3 rounded-md px-3 py-3">
                  {/* Status icon */}
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    {step.status === "complete" ? (
                      <div className="flex size-6 items-center justify-center rounded-full bg-foreground">
                        <Check className="size-3.5 text-background" strokeWidth={2.5} />
                      </div>
                    ) : step.status === "running" ? (
                      <Loader2 className="size-5 animate-spin text-foreground" />
                    ) : (
                      <CircleDashed className="size-5 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Step info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          step.status === "pending"
                            ? "text-muted-foreground/50"
                            : "text-foreground"
                        }`}
                      >
                        {step.name}
                      </span>
                      {step.status === "running" && (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Running
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs ${
                        step.status === "pending"
                          ? "text-muted-foreground/30"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="shrink-0 w-12 text-right">
                    {step.duration !== null && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {step.duration.toFixed(1)}s
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider between steps */}
                {index < steps.length - 1 && (
                  <hr className="mx-3 border-dashed" />
                )}
              </div>
            ))}
          </div>

          {/* Completion message */}
          {allComplete && (
            <div className="mt-8 text-center">
              <hr className="mb-6 border-dashed" />
              <p className="text-sm font-medium">
                Analysis complete. Loading results...
              </p>
              <Loader2 className="mx-auto mt-3 size-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
