import type { NextConfig } from "next";

// Die App wird als statischer Export auf GitHub Pages unter /arbitrage ausgeliefert.
// BASE_PATH kann für andere Hosts (z. B. Vercel an der Domain-Wurzel) leer gesetzt werden.
const basePath = process.env.BASE_PATH ?? "/arbitrage";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
