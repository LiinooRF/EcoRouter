"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Result = { ok: boolean; error?: string };

export async function agregarCamion(input: {
  patente: string;
  modelo: string;
  tipo: string;
}): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const patente = input.patente.trim().toUpperCase();
  if (!patente) return { ok: false, error: "La patente es obligatoria" };

  const { error } = await supabase.from("camiones").insert({
    patente,
    modelo: input.modelo.trim() || null,
    tipo: input.tipo,
    estado_operativo: "activo",
  });
  if (error) return { ok: false, error: error.message };

  await supabase.from("bitacora").insert({
    usuario: user.email,
    accion: "alta_camion",
    entidad: "camion",
    detalle: `Camión ${patente} agregado a la flota`,
  });
  revalidatePath("/app/flota");
  return { ok: true };
}

export async function agregarConductor(input: {
  nombre: string;
  licencia: string;
}): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const nombre = input.nombre.trim();
  if (!nombre) return { ok: false, error: "El nombre es obligatorio" };

  const { error } = await supabase.from("conductores").insert({
    nombre,
    licencia: input.licencia,
    disponible: true,
  });
  if (error) return { ok: false, error: error.message };

  await supabase.from("bitacora").insert({
    usuario: user.email,
    accion: "alta_conductor",
    entidad: "conductor",
    detalle: `Conductor ${nombre} (lic. ${input.licencia}) agregado`,
  });
  revalidatePath("/app/flota");
  return { ok: true };
}
