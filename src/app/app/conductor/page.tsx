import { getDespachosActivos } from "@/lib/queries";
import { ConductorTasks } from "./conductor-tasks";
import { Smartphone } from "lucide-react";

export default async function ConductorPage() {
  const tareas = await getDespachosActivos();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Mi ruta</h1>
        <p className="text-sm text-muted-foreground">
          Asignaciones activas y actualización de estado en terreno (RF-05).
        </p>
      </div>

      <div className="mx-auto flex max-w-md items-center gap-2 rounded-lg border border-dashed border-orange-300 bg-orange-50/60 p-3 text-xs text-orange-800">
        <Smartphone className="size-4 shrink-0" />
        Interfaz <b>mobile-first</b> con botones grandes para uso en terreno
        (RNF-06).
      </div>

      <ConductorTasks tareas={tareas} />
    </div>
  );
}
