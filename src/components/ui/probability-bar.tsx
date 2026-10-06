import type { RiskLevel } from "@/lib/domain/types";
import { chanceLevel } from "@/lib/engine/analysis";

const LABEL: Record<RiskLevel, string> = { hoch: "Hohe Chance", mittel: "Mittlere Chance", niedrig: "Geringe Chance" };
const DOT: Record<RiskLevel, string> = { hoch: "bg-good", mittel: "bg-warn", niedrig: "bg-bad" };

interface Props {
  probability: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Füllt die Leiste einmal beim Laden (nur im Hero). */
  animate?: boolean;
}

/**
 * Gewinnwahrscheinlichkeit als Leiste von Rot nach Grün. Der Verlauf ist über die volle Breite
 * fixiert, die Füllung zeigt also immer die Farbe, die zum Prozentwert gehört.
 */
export function ProbabilityBar({ probability, size = "md", className = "", animate = false }: Props) {
  const value = Math.round(Math.min(1, Math.max(0, probability)) * 100);
  const level = chanceLevel(probability);
  const height = size === "lg" ? "h-3" : size === "md" ? "h-2" : "h-1.5";

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-2">
          <span aria-hidden className={`size-1.5 rounded-full ${DOT[level]}`} />
          {LABEL[level]}
        </span>
        <span
          className={`tabular font-semibold tracking-tight text-ink ${
            size === "lg" ? "text-3xl" : size === "md" ? "text-lg" : "text-sm"
          }`}
        >
          {value}
          <span className="ml-0.5 text-[0.6em] font-medium text-muted">%</span>
        </span>
      </div>
      <div
        role="meter"
        aria-label="Gewinnwahrscheinlichkeit"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value} Prozent, ${LABEL[level]}`}
        className={`relative mt-2 w-full overflow-hidden rounded-full bg-line ${height}`}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out ${animate ? "animate-fill" : ""}`}
          style={{
            width: `${Math.max(value, 3)}%`,
            backgroundImage: "var(--probability-gradient)",
            backgroundSize: `${(100 / Math.max(value, 3)) * 100}% 100%`,
          }}
        />
      </div>
    </div>
  );
}

export function ChanceDot({ probability }: { probability: number }) {
  return <span aria-hidden className={`inline-block size-2 rounded-full ${DOT[chanceLevel(probability)]}`} />;
}
