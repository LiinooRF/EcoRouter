import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/** Perfil del usuario autenticado (incluye su rol). */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data as Profile | null;
}

export type DespachoRow = {
  id: number;
  numero_guia: string;
  cliente_nombre: string | null;
  estado: string;
  tipo_carga: string;
  fecha_creacion: string;
  fecha_estimada: string | null;
  rutas: { origen: string; destino: string } | null;
  conductores: { nombre: string } | null;
};

/** Datos agregados para el dashboard principal. */
export async function getDashboardData() {
  const supabase = await createClient();
  const [despachos, alertas, camiones, conductores, viaticos] =
    await Promise.all([
      supabase
        .from("despachos")
        .select(
          "id,numero_guia,cliente_nombre,estado,tipo_carga,fecha_creacion,fecha_estimada,rutas(origen,destino),conductores(nombre)",
        )
        .order("fecha_creacion", { ascending: false }),
      supabase
        .from("alertas")
        .select("*")
        .eq("activa", true)
        .order("fecha_hora", { ascending: false }),
      supabase.from("camiones").select("*"),
      supabase.from("conductores").select("*"),
      supabase.from("viaticos").select("monto_total"),
    ]);

  const despachosData = (despachos.data ?? []) as unknown as DespachoRow[];
  const camionesData = camiones.data ?? [];
  const conductoresData = conductores.data ?? [];

  const totalViaticos = (viaticos.data ?? []).reduce(
    (acc, v) => acc + Number(v.monto_total ?? 0),
    0,
  );

  return {
    despachos: despachosData,
    alertas: alertas.data ?? [],
    kpis: {
      camionesActivos: camionesData.filter(
        (c) => c.estado_operativo === "activo",
      ).length,
      camionesTotal: camionesData.length,
      despachosTotal: despachosData.length,
      enRuta: despachosData.filter((d) => d.estado === "en_transito").length,
      retrasados: despachosData.filter((d) => d.estado === "retrasado").length,
      entregados: despachosData.filter((d) => d.estado === "entregado").length,
      alertasCriticas: (alertas.data ?? []).filter(
        (a) => a.severidad === "critica",
      ).length,
      conductoresDisponibles: conductoresData.filter((c) => c.disponible).length,
      totalViaticos,
    },
  };
}
