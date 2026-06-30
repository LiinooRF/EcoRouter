"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { asignarCarga } from "./actions";
import { calcViatico } from "@/lib/viatico";
import { clp } from "@/lib/format";
import type { Ruta, Conductor, Camion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Fuel, Sparkles, CheckCircle2 } from "lucide-react";

const selectClass =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50";

export function AsignarForm({
  rutas,
  conductores,
  camiones,
}: {
  rutas: Ruta[];
  conductores: Conductor[];
  camiones: Camion[];
}) {
  const router = useRouter();
  const [cliente, setCliente] = useState("");
  const [tipoCarga, setTipoCarga] = useState("general");
  const [rutaId, setRutaId] = useState("");
  const [conductorId, setConductorId] = useState("");
  const [camionId, setCamionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [ultimaGuia, setUltimaGuia] = useState<string | null>(null);

  const ruta = rutas.find((r) => r.id === Number(rutaId));
  const viatico = ruta ? calcViatico(ruta.distancia_km) : null;

  // Sugerencia (RF-02): conductores disponibles primero
  const conductoresOrdenados = [...conductores].sort(
    (a, b) => Number(b.disponible) - Number(a.disponible),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rutaId || !conductorId || !camionId) {
      toast.error("Completa ruta, conductor y unidad");
      return;
    }
    setLoading(true);
    const res = await asignarCarga({
      rutaId: Number(rutaId),
      conductorId: Number(conductorId),
      camionId: Number(camionId),
      tipoCarga,
      cliente,
    });
    setLoading(false);
    if (res.ok) {
      toast.success(`Despacho ${res.guia} asignado`, {
        description: "Notificado al conductor y registrado en el historial.",
      });
      setUltimaGuia(res.guia ?? null);
      setCliente("");
      setRutaId("");
      setConductorId("");
      setCamionId("");
      router.refresh();
    } else {
      toast.error("No se pudo asignar", { description: res.error });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardContent className="grid gap-4 pt-2 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Input
              id="cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ej: Comercial Andes Ltda."
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de carga</Label>
            <select
              className={selectClass}
              value={tipoCarga}
              onChange={(e) => setTipoCarga(e.target.value)}
            >
              <option value="general">General</option>
              <option value="refrigerada">Refrigerada</option>
              <option value="peligrosa">Carga peligrosa</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Ruta</Label>
            <select
              className={selectClass}
              value={rutaId}
              onChange={(e) => setRutaId(e.target.value)}
            >
              <option value="">Selecciona una ruta…</option>
              {rutas.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.origen} → {r.destino} ({r.distancia_km.toLocaleString("es-CL")} km)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              Conductor <Sparkles className="size-3 text-orange-600" />
            </Label>
            <select
              className={selectClass}
              value={conductorId}
              onChange={(e) => setConductorId(e.target.value)}
            >
              <option value="">Selecciona un conductor…</option>
              {conductoresOrdenados.map((c) => (
                <option key={c.id} value={c.id} disabled={!c.disponible}>
                  {c.nombre} · Lic. {c.licencia} ·{" "}
                  {c.disponible ? "disponible" : "ocupado"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Unidad (camión)</Label>
            <select
              className={selectClass}
              value={camionId}
              onChange={(e) => setCamionId(e.target.value)}
            >
              <option value="">Selecciona una unidad…</option>
              {camiones.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.patente} · {c.modelo} ({c.tipo})
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Panel de viáticos + acción */}
      <div className="space-y-4">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-2">
            <p className="flex items-center gap-2 font-semibold text-orange-900">
              <Fuel className="size-4" /> Viáticos estimados (RF-06)
            </p>
            {viatico ? (
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distancia</span>
                  <span>{ruta!.distancia_km.toLocaleString("es-CL")} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Combustible</span>
                  <span>{clp(viatico.combustible)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peajes</span>
                  <span>{clp(viatico.peajes)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-dashed border-orange-300 pt-2 text-base font-bold text-orange-800">
                  <span>Total</span>
                  <span>{clp(viatico.total)}</span>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Selecciona una ruta para calcular los viáticos.
              </p>
            )}
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Confirmar asignación
        </Button>

        {ultimaGuia && (
          <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
            <CheckCircle2 className="size-4" />
            Última asignación: <b>{ultimaGuia}</b>
          </div>
        )}
      </div>
    </form>
  );
}
