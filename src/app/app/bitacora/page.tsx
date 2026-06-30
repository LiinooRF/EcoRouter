import { getBitacora } from "@/lib/queries";
import { fecha } from "@/lib/format";
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

const accionLabel: Record<string, string> = {
  asignacion_carga: "Asignación de carga",
  actualizacion_estado: "Cambio de estado",
  reporte_incidencia: "Reporte de incidencia",
  alta_camion: "Alta de camión",
  alta_conductor: "Alta de conductor",
};

export default async function BitacoraPage() {
  const filas = await getBitacora();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bitácora</h1>
        <p className="text-sm text-muted-foreground">
          Registro de acciones realizadas en el sistema (trazabilidad, RNF-10).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimas {filas.length} acciones</CardTitle>
          <CardDescription>Quién hizo qué y cuándo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Detalle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filas.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{fecha(f.created_at)}</TableCell>
                    <TableCell>{f.usuario ?? "sistema"}</TableCell>
                    <TableCell>
                      <span className="rounded-md bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-700">
                        {accionLabel[f.accion] ?? f.accion}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{f.detalle ?? "—"}</TableCell>
                  </TableRow>
                ))}
                {filas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      Aún no hay acciones registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
