import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cifras = [
  { k: "150", l: "camiones en operación" },
  { k: "3.090 km", l: "Santiago → Punta Arenas" },
  { k: "25% → 7%", l: "atrasos tras digitalizar" },
  { k: "10.000", l: "despachos por mes" },
];

const modulos: [string, string, string][] = [
  ["01", "Asignación de cargas", "Asigna conductor y camión según licencia, ruta y disponibilidad. Calcula los viáticos al instante."],
  ["02", "Seguimiento GPS", "Toda la flota en un mapa, con su estado y velocidad en ruta."],
  ["03", "Portal del cliente", "El cliente revisa el estado de su pedido con el número de guía, sin tener que llamar."],
  ["04", "Alertas en ruta", "Clima, atrasos y detenciones, ordenadas por gravedad."],
  ["05", "Reportes", "Cumplimiento por destino y uso de la flota, exportable a Excel."],
  ["06", "Acceso seguro", "Inicio de sesión con doble factor y permisos por perfil."],
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1c1d22]">
      <div className="h-1 w-full bg-orange-600" />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-sm bg-[#1c1d22] font-mono text-[11px] font-bold text-orange-500">
            ER
          </span>
          <span className="font-semibold tracking-tight">EcoRoute</span>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/track" className="px-3 py-2 text-[#1c1d22]/70 hover:text-[#1c1d22]">
            Rastrear pedido
          </Link>
          <Link href="/login" className={cn(buttonVariants(), "rounded-sm bg-orange-600 text-white hover:bg-orange-700")}>
            Acceder
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5">
        <section className="py-14 md:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange-700">
            Transportes Sur-Austral
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Coordinar 150 camiones sin planillas ni llamadas.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#1c1d22]/70">
            EcoRoute centraliza la operación logística entre Santiago y Punta
            Arenas. Asigna cargas, sigue la flota por GPS y le entrega al cliente
            el estado de su pedido en línea.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "rounded-sm bg-orange-600 text-white hover:bg-orange-700")}>
              Entrar al panel
            </Link>
            <Link href="/track" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-sm border-[#1c1d22]/20 text-[#1c1d22] hover:bg-[#1c1d22]/5")}>
              Soy cliente
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[#1c1d22]/10 bg-[#1c1d22]/10 md:grid-cols-4">
          {cifras.map((s) => (
            <div key={s.l} className="bg-[#faf8f4] p-5">
              <div className="font-mono text-2xl font-bold">{s.k}</div>
              <div className="mt-1 text-xs text-[#1c1d22]/55">{s.l}</div>
            </div>
          ))}
        </section>

        <section className="py-16">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[#1c1d22]/45">
            Módulos
          </h2>
          <div className="mt-6 border-y border-[#1c1d22]/10 divide-y divide-[#1c1d22]/10">
            {modulos.map((m) => (
              <div key={m[0]} className="grid grid-cols-12 gap-3 py-5">
                <div className="col-span-2 font-mono text-sm text-orange-700 md:col-span-1">{m[0]}</div>
                <div className="col-span-10 font-semibold md:col-span-3">{m[1]}</div>
                <div className="col-span-12 text-sm leading-relaxed text-[#1c1d22]/65 md:col-span-8">{m[2]}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1c1d22]/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-8 text-xs text-[#1c1d22]/50">
          <span className="font-semibold text-[#1c1d22]/75">EcoRoute Logistic AI</span>
          <span>Proyecto Ingeniería de Software · RQY1102 · 2026</span>
        </div>
      </footer>
    </div>
  );
}
