"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client/api";
import type { SessionUser } from "@/lib/client/user-context";
import type { ProviderId } from "@/lib/providers";

export interface AccountData {
  user: SessionUser & { createdAt: string };
  payments: { id: string; amount: number; description: string; status: string; createdAt: string; paidAt: string | null }[];
  connections: { provider: ProviderId; status: string; accountLabel: string | null; consentAt: string; updatedAt: string }[];
  integrations: { mollie: boolean; ebay: boolean; amazon: boolean; keepa: boolean };
}

export function useAccount() {
  const [data, setData] = useState<AccountData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async () => {
    try {
      const next = await api<AccountData>("/api/account/");
      setData(next);
      return next;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Konto konnte nicht geladen werden.");
      return null;
    }
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { data, error, reload, setData };
}
