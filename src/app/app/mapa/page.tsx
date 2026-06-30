import { getFleetPositions } from "@/lib/queries";
import { FleetMapClient } from "./fleet-map-client";
import { EstadoBadge } from "@/components/estado-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EstadoDespacho } from "@/lib/types";

export default async function MapaPage() {
  const points = await getFleetPositions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Monitoreo GPS de la flota</h1>
        <p className="text-sm text-muted-foreground">
          Ubicación en tiempo real de las unidades · Santiago → Punta Arenas
          (RF-03)
        </p>
      </div>

      <Card>
        <CardContent className="pt-2">
          <FleetMapClient points={points} />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-emerald-600" /> En ruta
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-amber-600" /> Detenido
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-red-600" /> Retrasado
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Unidades en seguimiento</CardTitle>
          <CardDescription>{points.length} camiones con reporte GPS activo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patente</TableHead>
                <TableHead>Conductor</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Velocidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {points.map((p) => (
                <TableRow key={p.camionId}>
                  <TableCell className="font-semibold">{p.patente}</TableCell>
                  <TableCell>{p.conductor ?? "—"}</TableCell>
                  <TableCell>{p.destino ?? "—"}</TableCell>
                  <TableCell>{p.velocidad} km/h</TableCell>
                  <TableCell>
                    {p.estado ? (
                      <EstadoBadge estado={p.estado as EstadoDespacho} />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin despacho</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
