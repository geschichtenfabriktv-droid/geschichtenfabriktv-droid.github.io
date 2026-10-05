export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Lade Marktdaten">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-[236px] animate-pulse rounded-[var(--radius-card)] bg-white ring-1 ring-line">
          <div className="space-y-3 p-5">
            <div className="h-3 w-24 rounded bg-canvas" />
            <div className="h-5 w-3/4 rounded bg-canvas" />
            <div className="h-3 w-1/2 rounded bg-canvas" />
            <div className="mt-8 h-10 rounded bg-canvas" />
            <div className="h-2 rounded bg-canvas" />
          </div>
        </div>
      ))}
    </div>
  );
}
