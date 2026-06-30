"use client";

import dynamic from "next/dynamic";
import type { FleetPoint } from "@/lib/queries";

const FleetMap = dynamic(() => import("./fleet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[68vh] items-center justify-center rounded-xl border bg-muted/30 text-muted-foreground">
      Cargando mapa…
    </div>
  ),
});

export function FleetMapClient({ points }: { points: FleetPoint[] }) {
  return <FleetMap points={points} />;
}
