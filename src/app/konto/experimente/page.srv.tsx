import { notFound } from "next/navigation";
import { AB_EVENT_LABELS, confidence, type AbEvent } from "@/lib/experiments";
import { abStats, isAdmin } from "@/server/experiments";
import { requirePageUser } from "@/server/page-guards";

export const dynamic = "force-dynamic";

const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} %` : "–");
const COLUMNS: AbEvent[] = ["ansicht", "klick", "checkout", "kauf"];

export default async function ExperimentsPage() {
  const user = await requirePageUser("/konto/experimente/");
  if (!isAdmin(user)) notFound();
  const stats = await abStats();

  return (
    <div className="space-y-8">
      <p className="max-w-[46rem] text-[15px] text-ink-2">
        Jeder Seitenaufruf bekommt per Zufall Variante A oder B. Gezählt werden nur Summen der letzten 90 Tage, ohne Cookies und ohne
        Personenbezug. Eine Variante gilt erst ab etwa 95 % Sicherheit und einigen hundert Ansichten je Variante als besser.
      </p>
      {stats.map((exp) => {
        const [a, b] = exp.variants;
        const clickConf = a && b ? confidence(a.counts.klick, a.counts.ansicht, b.counts.klick, b.counts.ansicht) : null;
        const buyConf = a && b ? confidence(a.counts.kauf, a.counts.ansicht, b.counts.kauf, b.counts.ansicht) : null;
        return (
          <section key={exp.id} className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line md:p-7">
            <h2 className="font-display text-[22px]">{exp.label}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="tabular w-full min-w-[560px] text-left text-[14px]">
                <thead className="text-muted">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Variante</th>
                    {COLUMNS.map((c) => (
                      <th key={c} className="py-2 pr-4 font-medium">
                        {AB_EVENT_LABELS[c]}
                      </th>
                    ))}
                    <th className="py-2 pr-4 font-medium">Klickrate</th>
                    <th className="py-2 font-medium">Kaufrate</th>
                  </tr>
                </thead>
                <tbody>
                  {exp.variants.map((v) => (
                    <tr key={v.variant} className="border-t border-line">
                      <td className="py-2 pr-4 font-semibold">{v.variant.toUpperCase()}</td>
                      {COLUMNS.map((c) => (
                        <td key={c} className="py-2 pr-4">
                          {v.counts[c].toLocaleString("de-DE")}
                        </td>
                      ))}
                      <td className="py-2 pr-4">{pct(v.counts.klick, v.counts.ansicht)}</td>
                      <td className="py-2">{pct(v.counts.kauf, v.counts.ansicht)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] text-muted">
              Sicherheit für einen Unterschied: Klicks {clickConf === null ? "–" : pct(clickConf, 1)}, Käufe {buyConf === null ? "–" : pct(buyConf, 1)}
            </p>
          </section>
        );
      })}
    </div>
  );
}
