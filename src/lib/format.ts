import type { EstadoDespacho, SeveridadAlerta, EstadoOperativo } from "./types";

/** Formatea un monto en pesos chilenos. */
export function clp(n: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Formatea una fecha ISO a formato local corto. */
export function fecha(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const ESTADO_LABEL: Record<EstadoDespacho, string> = {
  en_preparacion: "En preparación",
  en_transito: "En tránsito",
  en_aduana: "En aduana",
  retrasado: "Retrasado",
  entregado: "Entregado",
};

/** Variante de color (badge) por estado de despacho. */
export const ESTADO_VARIANT: Record<EstadoDespacho, string> = {
  en_preparacion: "bg-slate-100 text-slate-700 border-slate-200",
  en_transito: "bg-blue-100 text-blue-700 border-blue-200",
  en_aduana: "bg-amber-100 text-amber-700 border-amber-200",
  retrasado: "bg-red-100 text-red-700 border-red-200",
  entregado: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export const SEVERIDAD_VARIANT: Record<SeveridadAlerta, string> = {
  critica: "bg-red-50 border-l-red-500",
  media: "bg-amber-50 border-l-amber-500",
  info: "bg-blue-50 border-l-blue-500",
};

export const OPERATIVO_LABEL: Record<EstadoOperativo, string> = {
  activo: "Activo",
  mantencion: "Mantención",
  inactivo: "Inactivo",
};
