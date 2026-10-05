"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AddonId, BillingInterval, PlanId } from "@/lib/pricing";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  plan: PlanId | null;
  planInterval: BillingInterval | null;
  addons: AddonId[];
  status: string;
  currentPeriodEnd: string | null;
  hasAccess: boolean;
}

const Ctx = createContext<SessionUser | null>(null);

export function UserProvider({ user, children }: { user: SessionUser | null; children: ReactNode }) {
  return <Ctx.Provider value={user}>{children}</Ctx.Provider>;
}

/** Angemeldeter Nutzer im Dashboard; im Test-Dashboard null. */
export function useSessionUser() {
  return useContext(Ctx);
}
