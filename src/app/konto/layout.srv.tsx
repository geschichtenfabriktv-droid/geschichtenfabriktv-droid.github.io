import type { Metadata } from "next";
import { AppShell } from "@/components/shell/app-shell";
import { DashboardModeProvider } from "@/lib/client/dashboard-mode";
import { UserProvider } from "@/lib/client/user-context";
import { requirePageUser, toSessionUser } from "@/server/page-guards";
import { KontoTabs } from "./konto-tabs";

export const metadata: Metadata = { title: "Kundenkonto", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function KontoLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser("/konto/");
  return (
    <UserProvider user={toSessionUser(user)}>
      <DashboardModeProvider mode="app">
        <AppShell>
          <KontoTabs />
          {children}
        </AppShell>
      </DashboardModeProvider>
    </UserProvider>
  );
}
