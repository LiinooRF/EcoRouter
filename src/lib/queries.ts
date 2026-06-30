import { createClient } from "@/lib/supabase/server";
import type {
  Profile,
  Ruta,
  Conductor,
  Camion,
  Despacho,
} from "@/lib/types";

export { VIATICO, calcViatico } from "./viatico";

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

export type FleetPoint = {
  camionId: number;
  patente: string;
  modelo: string | null;
  lat: number;
  lng: number;
  velocidad: number;
  estado: string | null;
  numeroGuia: string | null;
  conductor: string | null;
  destino: string | null;
};

/** Posición GPS más reciente de cada camión, con su despacho activo (RF-03). */
export async function getFleetPositions(): Promise<FleetPoint[]> {
  const supabase = await createClient();
  const [camiones, posiciones, despachos] = await Promise.all([
    supabase.from("camiones").select("*"),
    supabase
      .from("posiciones_gps")
      .select("*")
      .order("registrado_at", { ascending: false }),
    supabase
      .from("despachos")
      .select(
        "id,numero_guia,estado,camion_id,rutas(destino),conductores(nombre)",
      )
      .neq("estado", "entregado"),
  ]);

  const cam = camiones.data ?? [];
  const pos = posiciones.data ?? [];
  const desp = (despachos.data ?? []) as unknown as Array<{
    camion_id: number | null;
    numero_guia: string;
    estado: string;
    rutas: { destino: string } | null;
    conductores: { nombre: string } | null;
  }>;

  return cam
    .map((c) => {
      const p = pos.find((x) => x.camion_id === c.id);
      const d = desp.find((x) => x.camion_id === c.id);
      if (!p) return null;
      return {
        camionId: c.id,
        patente: c.patente,
        modelo: c.modelo,
        lat: p.lat,
        lng: p.lng,
        velocidad: p.velocidad,
        estado: d?.estado ?? null,
        numeroGuia: d?.numero_guia ?? null,
        conductor: d?.conductores?.nombre ?? null,
        destino: d?.rutas?.destino ?? null,
      } as FleetPoint;
    })
    .filter((x): x is FleetPoint => x !== null);
}

/** Datos para el formulario de asignación (rutas, conductores y camiones). */
export async function getAsignacionData() {
  const supabase = await createClient();
  const [rutas, conductores, camiones] = await Promise.all([
    supabase.from("rutas").select("*").order("distancia_km", { ascending: false }),
    supabase.from("conductores").select("*").order("disponible", { ascending: false }),
    supabase.from("camiones").select("*").order("patente"),
  ]);
  return {
    rutas: (rutas.data ?? []) as Ruta[],
    conductores: (conductores.data ?? []) as Conductor[],
    camiones: (camiones.data ?? []) as Camion[],
  };
}

/** Historial completo de despachos (RF-09). */
export async function getDespachos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("despachos")
    .select(
      "id,numero_guia,cliente_nombre,estado,tipo_carga,fecha_creacion,fecha_estimada,rutas(origen,destino),conductores(nombre),viaticos(monto_total)",
    )
    .order("fecha_creacion", { ascending: false });
  return (data ?? []) as unknown as (Despacho & {
    rutas: { origen: string; destino: string } | null;
    conductores: { nombre: string } | null;
    viaticos: { monto_total: number } | null;
  })[];
}

/** Todas las alertas (RF-07 / RF-08), priorizadas por severidad. */
export async function getAlertas() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("alertas")
    .select("*, rutas(origen,destino), despachos(numero_guia)")
    .order("fecha_hora", { ascending: false });
  const orden: Record<string, number> = { critica: 0, media: 1, info: 2 };
  return (data ?? []).sort(
    (a, b) => (orden[a.severidad] ?? 9) - (orden[b.severidad] ?? 9),
  ) as unknown as Array<{
    id: number;
    tipo: string;
    severidad: string;
    titulo: string;
    descripcion: string | null;
    activa: boolean;
    fecha_hora: string;
    rutas: { origen: string; destino: string } | null;
    despachos: { numero_guia: string } | null;
  }>;
}

/** Despachos activos (no entregados) para la vista del conductor. */
export async function getDespachosActivos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("despachos")
    .select(
      "id,numero_guia,cliente_nombre,estado,tipo_carga,fecha_estimada,rutas(origen,destino,distancia_km),camiones(patente)",
    )
    .neq("estado", "entregado")
    .order("fecha_creacion", { ascending: false });
  return (data ?? []) as unknown as Array<{
    id: number;
    numero_guia: string;
    cliente_nombre: string | null;
    estado: string;
    tipo_carga: string;
    fecha_estimada: string | null;
    rutas: { origen: string; destino: string; distancia_km: number } | null;
    camiones: { patente: string } | null;
  }>;
}

/** Métricas de desempeño logístico (RF-10). */
export async function getReportes() {
  const supabase = await createClient();
  const [despachos, viaticos, camiones] = await Promise.all([
    supabase.from("despachos").select("estado, rutas(destino)"),
    supabase.from("viaticos").select("monto_total"),
    supabase.from("camiones").select("estado_operativo"),
  ]);

  const d = (despachos.data ?? []) as unknown as Array<{
    estado: string;
    rutas: { destino: string } | null;
  }>;
  const total = d.length;
  const entregados = d.filter((x) => x.estado === "entregado").length;
  const retrasados = d.filter((x) => x.estado === "retrasado").length;
  const aTiempo = total ? Math.round((entregados / total) * 100) : 0;
  const totalViaticos = (viaticos.data ?? []).reduce(
    (a, v) => a + Number(v.monto_total ?? 0),
    0,
  );
  const cam = camiones.data ?? [];
  const usoFlota = cam.length
    ? Math.round(
        (cam.filter((c) => c.estado_operativo === "activo").length /
          cam.length) *
          100,
      )
    : 0;

  const byDest: Record<string, { total: number; entregados: number }> = {};
  for (const x of d) {
    const dest = x.rutas?.destino ?? "Sin destino";
    byDest[dest] ??= { total: 0, entregados: 0 };
    byDest[dest].total++;
    if (x.estado === "entregado") byDest[dest].entregados++;
  }
  const zonas = Object.entries(byDest)
    .map(([destino, v]) => ({
      destino,
      total: v.total,
      entregados: v.entregados,
      pct: v.total ? Math.round((v.entregados / v.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    kpis: { total, entregados, retrasados, aTiempo, totalViaticos, usoFlota },
    zonas,
  };
}
