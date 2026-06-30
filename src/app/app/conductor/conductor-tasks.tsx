"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EstadoBadge } from "@/components/estado-badge";
import { toast } from "sonner";
import { ESTADO_LABEL } from "@/lib/format";
import type { EstadoDespacho } from "@/lib/types";
import { ArrowRight, TriangleAlert, MapPin, Loader2, PackageCheck } from "lucide-react";

type Tarea = {
  id: number;
  numero_guia: string;
  cliente_nombre: string | null;
  estado: string;
  tipo_carga: string;
  fecha_estimada: string | null;
  rutas: { origen: string; destino: string; distancia_km: number } | null;
};

const SIGUIENTE: Record<string, EstadoDespacho | null> = {
  en_preparacion: "en_transito",
  en_transito: "en_aduana",
  en_aduana: "entregado",
  retrasado: "en_transito",
  entregado: null,
};

export function ConductorTasks({ tareas }: { tareas: Tarea[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function avanzar(t: Tarea) {
    const sig = SIGUIENTE[t.estado];
    if (!sig) return;
    setBusy(t.id);
    const { error } = await supabase.rpc("actualizar_estado_despacho", {
      p_id: t.id,
      p_estado: sig,
    });
    setBusy(null);
    if (error) {
      toast.error("No se pudo actualizar", { description: error.message });
      return;
    }
    toast.success(`Despacho ${t.numero_guia}: ${ESTADO_LABEL[sig]}`);
    router.refresh();
  }

  async function incidencia(t: Tarea) {
    setBusy(t.id);
    const { error } = await supabase.rpc("reportar_incidencia", {
      p_despacho_id: t.id,
      p_titulo: `Incidencia reportada — Guía ${t.numero_guia}`,
      p_descripcion: "El conductor reportó una incidencia en ruta desde la app móvil.",
    });
    setBusy(null);
    if (error) {
      toast.error("No se pudo reportar", { description: error.message });
      return;
    }
    toast.success("Incidencia reportada al panel de alertas");
    router.refresh();
  }

  if (tareas.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          <PackageCheck className="mx-auto mb-2 size-10 text-orange-600" />
          No tienes asignaciones activas.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      {tareas.map((t) => {
        const sig = SIGUIENTE[t.estado];
        return (
          <Card key={t.id}>
            <CardContent className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-800">{t.numero_guia}</span>
                <EstadoBadge estado={t.estado as EstadoDespacho} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {t.rutas ? (
                  <span>
                    {t.rutas.origen} → {t.rutas.destino} ·{" "}
                    {t.rutas.distancia_km.toLocaleString("es-CL")} km
                  </span>
                ) : (
                  "Ruta sin asignar"
                )}
              </div>
              <p className="text-sm">
                Cliente: <span className="font-medium">{t.cliente_nombre ?? "—"}</span>
                {" · "}Carga: {t.tipo_carga}
              </p>

              {sig && (
                <Button
                  onClick={() => avanzar(t)}
                  disabled={busy === t.id}
                  className="h-12 w-full bg-orange-600 text-base hover:bg-orange-700"
                >
                  {busy === t.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                  Avanzar a: {ESTADO_LABEL[sig]}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => incidencia(t)}
                disabled={busy === t.id}
                className="h-11 w-full border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <TriangleAlert className="size-4" /> Reportar incidencia
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
