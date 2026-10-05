import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Einheitliches Open-Graph-Bild: Marke, Rubrik, Titel und Wahrscheinlichkeitsleiste. Ohne Personendaten. */
export async function ogImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  const serif = await readFile(join(process.cwd(), "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff"));
  const size = title.length > 60 ? 64 : title.length > 36 ? 76 : 92;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#0b0b0c", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l6-6 4 4 8-8" />
            </svg>
          </div>
          <div style={{ display: "flex", fontFamily: "Serif", fontSize: 40, color: "#0b0b0c" }}>Arbitrage</div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#8a8a8f", marginTop: 8 }}>RADAR</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#8a8a8f" }}>{eyebrow}</div>
          <div style={{ display: "flex", marginTop: 18, fontFamily: "Serif", fontSize: size, lineHeight: 1.02, color: "#0b0b0c", maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", flex: 1, height: 14, borderRadius: 999, background: "linear-gradient(90deg, #e2453c 0%, #e29b0b 45%, #11a05a 100%)" }} />
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#11a05a" }}>87 %</div>
          <div style={{ display: "flex", fontSize: 22, color: "#3f3f46" }}>arbitrageradar.de</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Serif", data: serif, style: "normal", weight: 400 }] },
  );
}
