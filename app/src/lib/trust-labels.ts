export type TrustLabel = "safe" | "caution" | "unsafe" | "dangerous" | "inconclusive";

export const trustLabelConfig: Record<
  TrustLabel,
  { label: string; description: string; colorClass: string; bgClass: string }
> = {
  safe: {
    label: "Safe",
    description: "No security issues detected. This skill appears safe to use.",
    colorClass: "text-trust-safe",
    bgClass: "bg-trust-safe",
  },
  caution: {
    label: "Caution",
    description:
      "Some concerns detected that may warrant review. No critical threats found.",
    colorClass: "text-trust-caution",
    bgClass: "bg-trust-caution",
  },
  unsafe: {
    label: "Unsafe",
    description: "Security threats detected. Review findings before using this skill.",
    colorClass: "text-trust-unsafe",
    bgClass: "bg-trust-unsafe",
  },
  dangerous: {
    label: "Dangerous",
    description:
      "Multiple critical security threats detected. Do not install this skill.",
    colorClass: "text-trust-dangerous",
    bgClass: "bg-trust-dangerous",
  },
  inconclusive: {
    label: "Inconclusive",
    description: "Analysis was inconclusive. Manual review recommended.",
    colorClass: "text-trust-inconclusive",
    bgClass: "bg-trust-inconclusive",
  },
};

export function deriveTrustLabel(findings: {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}): TrustLabel {
  if (findings.critical >= 2) return "dangerous";
  if (findings.critical >= 1 || findings.high >= 1) return "unsafe";
  if (findings.medium >= 1) return "caution";
  return "safe";
}
