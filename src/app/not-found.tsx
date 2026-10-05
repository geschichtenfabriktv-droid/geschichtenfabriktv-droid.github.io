import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-white px-6 text-center">
      <div>
        <p className="font-display text-[96px] leading-none">404</p>
        <p className="mt-4 text-ink-2">Diese Seite gibt es nicht (mehr).</p>
        <LinkButton href="/app/" className="mt-8">
          Zum Dashboard
        </LinkButton>
      </div>
    </main>
  );
}
