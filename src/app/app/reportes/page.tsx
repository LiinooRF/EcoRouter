import { getReportes } from "@/lib/queries";
import { clp } from "@/lib/format";
import { ExportCsv } from "./export-csv";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function ReportesPage() {
  const { kpis, zonas } = await getReportes();

  const stats = [
    { label: "Entregas a tiempo", value: `${kpis.aTiempo}%` },
    { label: "Despachos entregados", value: kpis.entregados },
    { label: "Viáticos acumulados", value: clp(kpis.totalViaticos) },
    { label: "Uso de flota", value: `${kpis.usoFlota}%` },
  ];

  const csvRows = zonas.map((z) => ({
    Destino: z.destino,
    Despachos: z.total,
    Entregados: z.entregados,
    "Cumplimiento %": z.pct,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reportes de desempeño</h1>
          <p className="text-sm text-muted-foreground">
            Cumplimiento logístico y utilización de la flota (RF-10).
          </p>
        </div>
        <ExportCsv rows={csvRows} filename="ecoroute-reporte-zonas.csv" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-2">
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cumplimiento por destino</CardTitle>
          <CardDescription>
            Porcentaje de despachos entregados sobre el total por ruta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {zonas.map((z) => (
            <div key={z.destino}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{z.destino}</span>
                <span className="text-muted-foreground">
                  {z.entregados}/{z.total} · {z.pct}%
                </span>
              </div>
              <Progress value={z.pct} />
            </div>
          ))}
          {zonas.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin datos de despachos.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
