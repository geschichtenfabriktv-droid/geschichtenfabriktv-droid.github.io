"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface DashboardRoutes {
  mode: "app" | "demo";
  list: string;
  deal: (id: string) => string;
  lots: string;
  lot: (id: string) => string;
  overview: string;
}

const APP: DashboardRoutes = {
  mode: "app",
  overview: "/app/",
  list: "/app/chancen/",
  deal: (id) => `/app/chancen/${id}/`,
  lots: "/app/insolvenzen/",
  lot: (id) => `/app/insolvenzen/${id}/`,
};

export const DEMO_ROUTES: DashboardRoutes = {
  mode: "demo",
  overview: "/demo/",
  list: "/demo/",
  deal: (id) => `/demo/chancen/${id}/`,
  lots: "/demo/insolvenzen/",
  lot: (id) => `/demo/insolvenzen/${id}/`,
};

const Ctx = createContext<DashboardRoutes>(APP);

export function DashboardModeProvider({ mode, children }: { mode: "app" | "demo"; children: ReactNode }) {
  return <Ctx.Provider value={mode === "demo" ? DEMO_ROUTES : APP}>{children}</Ctx.Provider>;
}

export function useDashboard() {
  return useContext(Ctx);
}
