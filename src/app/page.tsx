import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cifras = [
  { k: "150", l: "camiones" },
  { k: "3.090", l: "km por ruta" },
  { k: "25 → 7 %", l: "menos atrasos" },
  { k: "10.000", l: "despachos / mes" },
];

const modulos: [string, string, string][] = [
  ["01", "Asignación de cargas", "Conductor y camión según licencia, ruta y disponibilidad. Los viáticos se calculan solos."],
  ["02", "Seguimiento GPS", "Toda la flota en un mapa, con estado y velocidad en tiempo real."],
  ["03", "Portal del cliente", "El cliente ve su pedido con el número de guía. Se acabaron las llamadas."],
  ["04", "Alertas en ruta", "Clima, atrasos y detenciones, ordenadas por gravedad."],
  ["05", "Reportes", "Cumplimiento por destino y uso de flota, exportable a Excel."],
  ["06", "Acceso seguro", "Inicio de sesión con doble factor y permisos por perfil."],
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#15161a]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#131418] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 size-[34rem] rounded-full bg-orange-600/20 blur-[120px]" />

        {/* nav */}
        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-orange-600 font-mono text-xs font-bold">
              ER
            </span>
            <span className="text-lg font-semibold tracking-tight">EcoRoute</span>
          </div>
          <nav className="flex items-center gap-1.5 text-sm">
            <Link href="/track" className="rounded-md px-3 py-2 text-white/65 transition hover:bg-white/5 hover:text-white">
              Rastrear pedido
            </Link>
            <Link href="/login" className={cn(buttonVariants(), "rounded-md bg-orange-600 text-white hover:bg-orange-500")}>
              Acceder
            </Link>
          </nav>
        </header>

        {/* contenido hero */}
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-12 md:pb-24 md:pt-16">
          <div className="md:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-400">
              Transportes Sur-Austral
            </p>
            <h1 className="mt-4 text-[2.6rem] font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Mueve la flota,
              <br />
              <span className="text-orange-500">no las planillas.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
              La plataforma que coordina 150 camiones entre Santiago y Punta
              Arenas: cargas, GPS en vivo y seguimiento para el cliente, todo en
              un mismo lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-orange-600 text-white hover:bg-orange-500")}>
                Entrar al panel
              </Link>
              <Link href="/track" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-md border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white")}>
                Soy cliente
              </Link>
            </div>
          </div>

          {/* mapa-ruta decorativo */}
          <div className="hidden md:col-span-5 md:block">
            <svg viewBox="0 0 320 380" className="ml-auto w-full max-w-xs" fill="none">
              <path d="M120 30 C 60 110, 230 150, 150 240 S 90 330, 170 355" stroke="#f97316" strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round" />
              {[[120, 30, "Santiago"], [150, 240, "Pto. Montt"], [170, 355, "Punta Arenas"]].map(([x, y, n], i) => (
                <g key={i}>
                  <circle cx={x as number} cy={y as number} r="7" fill="#f97316" />
                  <circle cx={x as number} cy={y as number} r="13" fill="#f97316" opacity="0.18" />
                  <text x={(x as number) + 20} y={(y as number) + 4} fill="rgba(255,255,255,0.55)" fontSize="12" fontFamily="monospace">{n}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* cifras */}
        <div className="relative border-t border-white/10">
          <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
            {cifras.map((s, i) => (
              <div key={s.l} className={cn("px-5 py-6", i < 3 && "md:border-r", "border-white/10", i < 2 && "border-b md:border-b-0")}>
                <div className="font-mono text-2xl font-bold sm:text-3xl">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-white/45">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MÓDULOS ===== */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Lo que hace por dentro
          </h2>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#15161a]/40">
            6 módulos
          </span>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[#15161a]/10 bg-[#15161a]/10 sm:grid-cols-2 lg:grid-cols-3">
          {modulos.map((m) => (
            <div key={m[0]} className="group bg-[#faf8f4] p-6 transition hover:bg-white">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-orange-600">{m[0]}</span>
                <span className="h-0.5 w-8 bg-[#15161a]/15 transition group-hover:w-12 group-hover:bg-orange-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{m[1]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#15161a]/60">{m[2]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-[#131418] p-8 text-white sm:flex-row sm:items-center md:p-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">¿Probamos?</h2>
            <p className="mt-2 text-white/60">Entra con la cuenta demo o rastrea un pedido de ejemplo.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "rounded-md bg-orange-600 text-white hover:bg-orange-500")}>
              Entrar
            </Link>
            <Link href="/track" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-md border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white")}>
              Rastrear
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#15161a]/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-8 text-xs text-[#15161a]/45">
          <span className="font-semibold text-[#15161a]/70">EcoRoute Logistic AI</span>
          <span>Proyecto Ingeniería de Software · RQY1102 · 2026</span>
        </div>
      </footer>
    </div>
  );
}
