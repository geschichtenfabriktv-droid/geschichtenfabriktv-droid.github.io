import type { Metadata } from "next";
import { AppShell } from "@/components/shell/app-shell";
import { DashboardModeProvider } from "@/lib/client/dashboard-mode";
import { UserProvider } from "@/lib/client/user-context";
import { requireSubscriber, toSessionUser } from "@/server/page-guards";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSubscriber("/app/");
  return (
    <UserProvider user={toSessionUser(user)}>
      <DashboardModeProvider mode="app">
        <AppShell>{children}</AppShell>
      </DashboardModeProvider>
    </UserProvider>
  );
}
