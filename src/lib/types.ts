// Tipos del dominio EcoRoute (alineados al esquema de la BD)

export type Rol = "admin" | "conductor" | "cliente" | "soporte";
export type EstadoDespacho =
  | "en_preparacion"
  | "en_transito"
  | "en_aduana"
  | "retrasado"
  | "entregado";
export type EstadoOperativo = "activo" | "mantencion" | "inactivo";
export type TipoLicencia = "A-1" | "A-2" | "A-3" | "A-4" | "A-5";
export type TipoAlerta =
  | "clima"
  | "retraso"
  | "detencion"
  | "incidencia"
  | "mantencion";
export type SeveridadAlerta = "critica" | "media" | "info";
export type TipoCarga = "general" | "refrigerada" | "peligrosa";

export interface Profile {
  id: string;
  nombre: string;
  email: string | null;
  rol: Rol;
  area: string | null;
  nivel_acceso: number | null;
  telefono: string | null;
}

export interface Camion {
  id: number;
  patente: string;
  modelo: string | null;
  tipo: TipoCarga;
  estado_operativo: EstadoOperativo;
}

export interface Conductor {
  id: number;
  nombre: string;
  licencia: TipoLicencia;
  disponible: boolean;
  camion_id: number | null;
}

export interface Ruta {
  id: number;
  origen: string;
  destino: string;
  distancia_km: number;
}

export interface Despacho {
  id: number;
  numero_guia: string;
  cliente_nombre: string | null;
  estado: EstadoDespacho;
  conductor_id: number | null;
  camion_id: number | null;
  ruta_id: number | null;
  tipo_carga: TipoCarga;
  fecha_creacion: string;
  fecha_estimada: string | null;
  fecha_entrega: string | null;
}

export interface Alerta {
  id: number;
  tipo: TipoAlerta;
  severidad: SeveridadAlerta;
  titulo: string;
  descripcion: string | null;
  ruta_id: number | null;
  despacho_id: number | null;
  activa: boolean;
  fecha_hora: string;
}

export interface PosicionGps {
  id: number;
  camion_id: number;
  lat: number;
  lng: number;
  velocidad: number;
  registrado_at: string;
}
