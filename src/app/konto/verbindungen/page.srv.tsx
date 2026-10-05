import { Suspense } from "react";
import { ConnectionsView } from "./connections-view";

export default function Page() {
  return (
    <Suspense>
      <ConnectionsView />
    </Suspense>
  );
}
