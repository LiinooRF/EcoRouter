"use server";

import { createClient } from "@/lib/supabase/server";
import { calcViatico } from "@/lib/queries";
import { revalidatePath } from "next/cache";

export type AsignarResult = { ok: boolean; guia?: string; error?: string };

export async function asignarCarga(input: {
  rutaId: number;
  conductorId: number;
  camionId: number;
  tipoCarga: string;
  cliente: string;
}): Promise<AsignarResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const { data: ruta } = await supabase
    .from("rutas")
    .select("distancia_km")
    .eq("id", input.rutaId)
    .single();
  if (!ruta) return { ok: false, error: "Ruta inválida" };

  const v = calcViatico(ruta.distancia_km);

  // Genera el siguiente número de guía (SA-2026-#####)
  const { data: last } = await supabase
    .from("despachos")
    .select("numero_guia")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();
  let next = 10483;
  const m = last?.numero_guia?.match(/(\d+)$/);
  if (m) next = parseInt(m[1], 10) + 1;
  const guia = `SA-2026-${next}`;

  // Fecha estimada según distancia (~700 km/día)
  const dias = Math.max(1, Math.ceil(ruta.distancia_km / 700));
  const fechaEstimada = new Date(Date.now() + dias * 86400000)
    .toISOString()
    .slice(0, 10);

  const { data: despacho, error } = await supabase
    .from("despachos")
    .insert({
      numero_guia: guia,
      cliente_nombre: input.cliente || "Cliente sin nombre",
      estado: "en_preparacion",
      conductor_id: input.conductorId,
      camion_id: input.camionId,
      ruta_id: input.rutaId,
      tipo_carga: input.tipoCarga,
      fecha_estimada: fechaEstimada,
    })
    .select("id")
    .single();

  if (error || !despacho)
    return { ok: false, error: error?.message ?? "No se pudo crear el despacho" };

  // Viático (RF-06) + marca conductor ocupado + bitácora (RNF-10)
  await supabase
    .from("viaticos")
    .insert({ despacho_id: despacho.id, combustible: v.combustible, peajes: v.peajes });
  await supabase
    .from("conductores")
    .update({ disponible: false })
    .eq("id", input.conductorId);
  await supabase.from("bitacora").insert({
    usuario: user.email,
    accion: "asignacion_carga",
    entidad: "despacho",
    detalle: `Guía ${guia} asignada · viático estimado ${v.total}`,
  });

  revalidatePath("/app/despachos");
  revalidatePath("/app");
  return { ok: true, guia };
}
