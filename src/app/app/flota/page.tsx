import { getFlota } from "@/lib/queries";
import { OPERATIVO_LABEL } from "@/lib/format";
import { FormCamion, FormConductor } from "./flota-forms";
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
import { cn } from "@/lib/utils";
import type { EstadoOperativo } from "@/lib/types";

const estadoColor: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  mantencion: "bg-amber-100 text-amber-700",
  inactivo: "bg-slate-100 text-slate-600",
};

export default async function FlotaPage() {
  const { camiones, conductores } = await getFlota();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flota</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de camiones y conductores de Transportes Sur-Austral.
        </p>
      </div>

      {/* Camiones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Camiones ({camiones.length})</CardTitle>
          <CardDescription>Unidades registradas en la flota</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border bg-muted/30 p-4">
            <FormCamion />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patente</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {camiones.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-semibold">{c.patente}</TableCell>
                  <TableCell>{c.modelo ?? "—"}</TableCell>
                  <TableCell className="capitalize">{c.tipo}</TableCell>
                  <TableCell>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", estadoColor[c.estado_operativo])}>
                      {OPERATIVO_LABEL[c.estado_operativo as EstadoOperativo]}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Conductores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conductores ({conductores.length})</CardTitle>
          <CardDescription>Personal de conducción y disponibilidad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border bg-muted/30 p-4">
            <FormConductor />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Licencia</TableHead>
                <TableHead>Camión</TableHead>
                <TableHead>Disponibilidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conductores.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-semibold">{c.nombre}</TableCell>
                  <TableCell>{c.licencia}</TableCell>
                  <TableCell>{c.camiones?.patente ?? "—"}</TableCell>
                  <TableCell>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", c.disponible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600")}>
                      {c.disponible ? "Disponible" : "Ocupado"}
                    </span>
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
