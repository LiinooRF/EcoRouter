import { getAlertas } from "@/lib/queries";
import { fecha, SEVERIDAD_VARIANT } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CloudSnow,
  Clock,
  OctagonX,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const TIPO_ICON: Record<string, LucideIcon> = {
  clima: CloudSnow,
  retraso: Clock,
  detencion: OctagonX,
  incidencia: TriangleAlert,
  mantencion: Wrench,
};

const SEVERIDAD_LABEL: Record<string, string> = {
  critica: "Crítica",
  media: "Media",
  info: "Informativa",
};

export default async function AlertasPage() {
  const alertas = await getAlertas();
  const activas = alertas.filter((a) => a.activa);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Panel de alertas operativas</h1>
        <p className="text-sm text-muted-foreground">
          Clima, retrasos y detenciones priorizados por impacto (RF-07 · RF-08).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {activas.length} alertas activas
          </CardTitle>
          <CardDescription>
            {alertas.filter((a) => a.severidad === "critica").length} críticas ·{" "}
            {alertas.filter((a) => a.severidad === "media").length} medias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {alertas.map((a) => {
            const Icon = TIPO_ICON[a.tipo] ?? TriangleAlert;
            return (
              <div
                key={a.id}
                className={cn(
                  "flex gap-3 rounded-lg border-l-4 p-4",
                  SEVERIDAD_VARIANT[a.severidad as keyof typeof SEVERIDAD_VARIANT],
                  !a.activa && "opacity-50",
                )}
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-foreground/70" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold leading-tight">{a.titulo}</p>
                    <span className="rounded-full border bg-background/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                      {SEVERIDAD_LABEL[a.severidad] ?? a.severidad}
                    </span>
                  </div>
                  {a.descripcion && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {a.descripcion}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.rutas ? `${a.rutas.origen} → ${a.rutas.destino} · ` : ""}
                    {a.despachos ? `Guía ${a.despachos.numero_guia} · ` : ""}
                    {fecha(a.fecha_hora)}
                  </p>
                </div>
              </div>
            );
          })}
          {alertas.length === 0 && (
            <p className="text-sm text-muted-foreground">No hay alertas registradas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
