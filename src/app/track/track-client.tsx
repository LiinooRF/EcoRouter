"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fecha, ESTADO_LABEL } from "@/lib/format";
import type { EstadoDespacho } from "@/lib/types";
import { Loader2, Search, PackageSearch, Check } from "lucide-react";

type Resultado = {
  numero_guia: string;
  estado: EstadoDespacho;
  cliente_nombre: string | null;
  origen: string | null;
  destino: string | null;
  conductor: string | null;
  fecha_estimada: string | null;
  fecha_entrega: string | null;
};

const PASOS: { key: EstadoDespacho; label: string }[] = [
  { key: "en_preparacion", label: "En preparación" },
  { key: "en_transito", label: "En tránsito" },
  { key: "en_aduana", label: "En aduana" },
  { key: "entregado", label: "Entregado" },
];

function pasoActual(estado: EstadoDespacho) {
  if (estado === "retrasado") return 1;
  const i = PASOS.findIndex((p) => p.key === estado);
  return i < 0 ? 0 : i;
}

export function TrackClient() {
  const supabase = createClient();
  const [guia, setGuia] = useState("SA-2026-10481");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Resultado | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function buscar(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setNotFound(false);
    setRes(null);
    const { data, error } = await supabase.rpc("consultar_despacho", {
      p_guia: guia,
    });
    setLoading(false);
    if (error || !data || data.length === 0) {
      setNotFound(true);
      return;
    }
    setRes(data[0] as Resultado);
  }

  const actual = res ? pasoActual(res.estado) : 0;

  return (
    <div className="space-y-5">
      <form onSubmit={buscar} className="flex gap-2">
        <Input
          value={guia}
          onChange={(e) => setGuia(e.target.value)}
          placeholder="Ej: SA-2026-10481"
          className="text-base"
        />
        <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Buscar
        </Button>
      </form>

      {notFound && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No se encontró un despacho con esa guía. Prueba con{" "}
          <button className="font-semibold underline" onClick={() => setGuia("SA-2026-10481")}>
            SA-2026-10481
          </button>
          .
        </div>
      )}

      {res && (
        <Card>
          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Guía</p>
                <p className="text-lg font-bold">{res.numero_guia}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-semibold",
                  res.estado === "retrasado"
                    ? "bg-red-100 text-red-700"
                    : res.estado === "entregado"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700",
                )}
              >
                {ESTADO_LABEL[res.estado]}
              </span>
            </div>

            {/* Línea de tiempo */}
            <div className="flex justify-between">
              {PASOS.map((p, i) => {
                const done = i < actual;
                const active = i === actual;
                return (
                  <div key={p.key} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center">
                      <div className={cn("h-0.5 flex-1", i === 0 ? "opacity-0" : done || active ? "bg-emerald-500" : "bg-muted")} />
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold",
                          done
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : active
                              ? "border-emerald-500 text-emerald-600"
                              : "border-muted text-muted-foreground",
                        )}
                      >
                        {done ? <Check className="size-4" /> : i + 1}
                      </div>
                      <div className={cn("h-0.5 flex-1", i === PASOS.length - 1 ? "opacity-0" : done ? "bg-emerald-500" : "bg-muted")} />
                    </div>
                    <span className={cn("mt-1.5 text-xs", done || active ? "font-medium" : "text-muted-foreground")}>
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 text-sm">
              {[
                ["Cliente", res.cliente_nombre ?? "—"],
                ["Origen", res.origen ?? "—"],
                ["Destino", res.destino ?? "—"],
                ["Conductor", res.conductor ?? "—"],
                ["Entrega estimada", res.fecha_estimada ?? "—"],
                ["Entregado", res.fecha_entrega ? fecha(res.fecha_entrega) : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b py-1.5 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!res && !notFound && (
        <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
          <PackageSearch className="size-10" />
          <p className="text-sm">Ingresa tu número de guía para ver el estado.</p>
        </div>
      )}
    </div>
  );
}
