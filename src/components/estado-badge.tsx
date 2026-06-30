import { cn } from "@/lib/utils";
import { ESTADO_LABEL, ESTADO_VARIANT } from "@/lib/format";
import type { EstadoDespacho } from "@/lib/types";

export function EstadoBadge({ estado }: { estado: EstadoDespacho }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        ESTADO_VARIANT[estado],
      )}
    >
      {ESTADO_LABEL[estado]}
    </span>
  );
}
