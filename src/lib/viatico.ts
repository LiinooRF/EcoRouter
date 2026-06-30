// Cálculo de viáticos (RF-06) — módulo puro, usable en cliente y servidor.

export const VIATICO = {
  LITROS_POR_KM: 0.35,
  PRECIO_LITRO: 1050,
  PEAJE_POR_KM: 95,
} as const;

export function calcViatico(distanciaKm: number) {
  const combustible = Math.round(
    distanciaKm * VIATICO.LITROS_POR_KM * VIATICO.PRECIO_LITRO,
  );
  const peajes = Math.round(distanciaKm * VIATICO.PEAJE_POR_KM);
  return { combustible, peajes, total: combustible + peajes };
}
