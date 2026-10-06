import type { ReactNode } from "react";

/**
 * Früher eine Einblend-Animation je Abschnitt. Bewusst entfernt: Bewegung gibt es nur an einer
 * Stelle (Preisschild im Hero). Die Komponente bleibt als schlichter Container erhalten.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return <div className={`min-w-0 ${className}`}>{children}</div>;
}
