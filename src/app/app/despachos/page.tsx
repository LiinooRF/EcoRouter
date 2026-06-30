import Link from "next/link";
import { getDespachos } from "@/lib/queries";
import { EstadoBadge } from "@/components/estado-badge";
import { clp, fecha } from "@/lib/format";
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

export default async function DespachosPage() {
  const despachos = await getDespachos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial de despachos</h1>
        <p className="text-sm text-muted-foreground">
          Trazabilidad completa de cada envío y sus viáticos (RF-09).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{despachos.length} despachos</CardTitle>
          <CardDescription>Ordenados por fecha de creación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guía</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Conductor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Viático</TableHead>
                  <TableHead>Creado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {despachos.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-semibold">
                      <Link href={`/app/despachos/${d.id}`} className="text-orange-700 hover:underline">
                        {d.numero_guia}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.cliente_nombre ?? "—"}
                    </TableCell>
                    <TableCell>
                      {d.rutas ? `${d.rutas.origen} → ${d.rutas.destino}` : "—"}
                    </TableCell>
                    <TableCell>{d.conductores?.nombre ?? "—"}</TableCell>
                    <TableCell>
                      <EstadoBadge estado={d.estado as EstadoDespacho} />
                    </TableCell>
                    <TableCell className="text-right">
                      {d.viaticos ? clp(Number(d.viaticos.monto_total)) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fecha(d.fecha_creacion)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
