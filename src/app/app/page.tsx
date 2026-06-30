import { redirect } from "next/navigation";
import { getProfile, getDashboardData } from "@/lib/queries";
import { EstadoBadge } from "@/components/estado-badge";
import { clp, fecha, SEVERIDAD_VARIANT } from "@/lib/format";
import { cn } from "@/lib/utils";
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
import {
  Truck,
  PackageCheck,
  Navigation,
  TriangleAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { EstadoDespacho } from "@/lib/types";

export default async function DashboardPage() {
  const profile = await getProfile();
  if (profile?.rol === "conductor") redirect("/app/conductor");

  const { despachos, alertas, kpis } = await getDashboardData();

  const stats = [
    {
      label: "Camiones activos",
      value: `${kpis.camionesActivos}/${kpis.camionesTotal}`,
      icon: Truck,
      color: "text-orange-700 bg-orange-50",
      foot: `${kpis.conductoresDisponibles} conductores disponibles`,
      trend: "up" as const,
    },
    {
      label: "Despachos activos",
      value: kpis.despachosTotal,
      icon: PackageCheck,
      color: "text-blue-600 bg-blue-50",
      foot: `${kpis.entregados} entregados`,
      trend: "up" as const,
    },
    {
      label: "En ruta ahora",
      value: kpis.enRuta,
      icon: Navigation,
      color: "text-indigo-600 bg-indigo-50",
      foot: "Seguimiento GPS activo",
      trend: "up" as const,
    },
    {
      label: "Alertas críticas",
      value: kpis.alertasCriticas,
      icon: TriangleAlert,
      color: "text-red-600 bg-red-50",
      foot: `${kpis.retrasados} despachos retrasados`,
      trend: "down" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard operativo</h1>
        <p className="text-sm text-muted-foreground">
          Resumen en tiempo real de la flota de Transportes Sur-Austral.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-extrabold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
                <div className={cn("rounded-xl p-2.5", s.color)}>
                  <s.icon className="size-5" />
                </div>
              </div>
              <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                {s.trend === "up" ? (
                  <TrendingUp className="size-3.5 text-orange-600" />
                ) : (
                  <TrendingDown className="size-3.5 text-red-500" />
                )}
                {s.foot}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Despachos recientes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Despachos recientes</CardTitle>
            <CardDescription>
              Trazabilidad de los últimos envíos (RF-09)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guía</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {despachos.slice(0, 6).map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-semibold">{d.numero_guia}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.cliente_nombre ?? "—"}
                    </TableCell>
                    <TableCell>{d.rutas?.destino ?? "—"}</TableCell>
                    <TableCell>
                      <EstadoBadge estado={d.estado as EstadoDespacho} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alertas activas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alertas activas</CardTitle>
            <CardDescription>Priorizadas por impacto (RF-08)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertas.slice(0, 5).map((a) => (
              <div
                key={a.id}
                className={cn(
                  "rounded-lg border-l-4 p-3",
                  SEVERIDAD_VARIANT[a.severidad as keyof typeof SEVERIDAD_VARIANT],
                )}
              >
                <p className="text-sm font-semibold leading-tight">{a.titulo}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{fecha(a.fecha_hora)}</p>
              </div>
            ))}
            {alertas.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin alertas activas.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Nota de mejora */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="flex items-center gap-3 py-4 text-sm">
          <TrendingDown className="size-5 text-orange-700" />
          <span>
            La digitalización redujo los retrasos de entrega del{" "}
            <b>25% (gestión manual)</b> a un objetivo operativo del <b>7%</b>,
            con visibilidad GPS de extremo a extremo.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
