import Link from "next/link";
import { notFound } from "next/navigation";
import { getDespachoDetalle } from "@/lib/queries";
import { EstadoBadge } from "@/components/estado-badge";
import { AdvanceState } from "./advance-state";
import { clp, fecha, ESTADO_LABEL, SEVERIDAD_VARIANT } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { EstadoDespacho } from "@/lib/types";

const PASOS: EstadoDespacho[] = ["en_preparacion", "en_transito", "en_aduana", "entregado"];
function pasoActual(estado: string) {
  if (estado === "retrasado") return 1;
  const i = PASOS.indexOf(estado as EstadoDespacho);
  return i < 0 ? 0 : i;
}

export default async function DespachoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = await getDespachoDetalle(Number(id));
  if (!d) notFound();

  const actual = pasoActual(d.estado);

  const datos: [string, string][] = [
    ["Cliente", d.cliente_nombre ?? "—"],
    ["Ruta", d.rutas ? `${d.rutas.origen} → ${d.rutas.destino} (${d.rutas.distancia_km.toLocaleString("es-CL")} km)` : "—"],
    ["Conductor", d.conductores ? `${d.conductores.nombre} · Lic. ${d.conductores.licencia}` : "—"],
    ["Camión", d.camiones ? `${d.camiones.patente} · ${d.camiones.modelo ?? ""}` : "—"],
    ["Tipo de carga", d.tipo_carga],
    ["Creado", fecha(d.fecha_creacion)],
    ["Entrega estimada", d.fecha_estimada ?? "—"],
    ["Entregado", d.fecha_entrega ? fecha(d.fecha_entrega) : "—"],
  ];

  return (
    <div className="space-y-6">
      <Link href="/app/despachos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Volver a despachos
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{d.numero_guia}</h1>
          <p className="text-sm text-muted-foreground">Ficha del despacho</p>
        </div>
        <div className="flex items-center gap-3">
          <EstadoBadge estado={d.estado as EstadoDespacho} />
          <AdvanceState id={d.id} estado={d.estado} />
        </div>
      </div>

      {/* Línea de tiempo */}
      <Card>
        <CardContent className="pt-2">
          <div className="flex justify-between">
            {PASOS.map((p, i) => {
              const done = i < actual;
              const active = i === actual;
              return (
                <div key={p} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    <div className={cn("h-0.5 flex-1", i === 0 ? "opacity-0" : done || active ? "bg-orange-500" : "bg-muted")} />
                    <div className={cn("flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold", done ? "border-orange-500 bg-orange-500 text-white" : active ? "border-orange-500 text-orange-600" : "border-muted text-muted-foreground")}>
                      {done ? "✓" : i + 1}
                    </div>
                    <div className={cn("h-0.5 flex-1", i === PASOS.length - 1 ? "opacity-0" : done ? "bg-orange-500" : "bg-muted")} />
                  </div>
                  <span className={cn("mt-1.5 text-xs", done || active ? "font-medium" : "text-muted-foreground")}>
                    {ESTADO_LABEL[p]}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Información</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {datos.map(([k, v]) => (
                <div key={k} className="flex justify-between border-b py-1.5 text-sm sm:block sm:border-0 sm:py-0">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium sm:mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Viáticos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {d.viaticos ? (
              <>
                <div className="flex justify-between"><span className="text-muted-foreground">Combustible</span><span>{clp(Number(d.viaticos.combustible))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Peajes</span><span>{clp(Number(d.viaticos.peajes))}</span></div>
                <div className="mt-1 flex justify-between border-t border-dashed pt-2 text-base font-bold text-orange-700"><span>Total</span><span>{clp(Number(d.viaticos.monto_total))}</span></div>
              </>
            ) : (
              <p className="text-muted-foreground">Sin viáticos registrados.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {d.alertas?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alertas asociadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {d.alertas.map((a) => (
              <div key={a.id} className={cn("rounded-lg border-l-4 p-3", SEVERIDAD_VARIANT[a.severidad as keyof typeof SEVERIDAD_VARIANT])}>
                <p className="text-sm font-semibold">{a.titulo}</p>
                <p className="text-xs text-muted-foreground">{fecha(a.fecha_hora)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
