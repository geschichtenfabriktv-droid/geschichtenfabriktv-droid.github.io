import { Suspense } from "react";
import { SubscriptionView } from "./subscription-view";

export default function KontoPage() {
  return (
    <Suspense>
      <SubscriptionView />
    </Suspense>
  );
}
