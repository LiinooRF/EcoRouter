import { getAsignacionData } from "@/lib/queries";
import { AsignarForm } from "./asignar-form";

export default async function AsignarPage() {
  const { rutas, conductores, camiones } = await getAsignacionData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Asignación de cargas</h1>
        <p className="text-sm text-muted-foreground">
          Asignación según disponibilidad, licencia y ruta compatible. Cálculo
          automático de viáticos (RF-01 · RF-02 · RF-06).
        </p>
      </div>
      <AsignarForm rutas={rutas} conductores={conductores} camiones={camiones} />
    </div>
  );
}
