"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FleetPoint } from "@/lib/queries";
import { ESTADO_LABEL } from "@/lib/format";
import type { EstadoDespacho } from "@/lib/types";

function colorFor(estado: string | null, velocidad: number) {
  if (estado === "retrasado") return "#dc2626";
  if (velocidad === 0) return "#d97706";
  return "#059669";
}

function makeIcon(color: string) {
  return L.divIcon({
    className: "ecoroute-marker",
    html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.5)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export default function FleetMap({ points }: { points: FleetPoint[] }) {
  return (
    <MapContainer
      center={[-43, -72]}
      zoom={4}
      scrollWheelZoom
      style={{ height: "68vh", width: "100%", borderRadius: "12px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <Marker
          key={p.camionId}
          position={[p.lat, p.lng]}
          icon={makeIcon(colorFor(p.estado, p.velocidad))}
        >
          <Popup>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <b>
                {p.patente} · {p.modelo}
              </b>
              <br />
              Conductor: {p.conductor ?? "—"}
              <br />
              Guía: {p.numeroGuia ?? "—"}
              <br />
              Estado:{" "}
              {p.estado
                ? ESTADO_LABEL[p.estado as EstadoDespacho] ?? p.estado
                : "Sin despacho"}
              <br />
              Velocidad: {p.velocidad} km/h
              <br />
              Destino: {p.destino ?? "—"}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
