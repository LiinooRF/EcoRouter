import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Truck,
  MapPin,
  PackageSearch,
  ShieldCheck,
  CloudSnow,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const features = [
  { icon: Truck, title: "Asignación automática", desc: "Cargas a conductores según licencia y disponibilidad (RF-01)." },
  { icon: MapPin, title: "GPS en tiempo real", desc: "Ubicación de toda la flota sobre mapa interactivo (RF-03)." },
  { icon: PackageSearch, title: "Portal del cliente", desc: "Seguimiento del pedido por número de guía (RF-04)." },
  { icon: CloudSnow, title: "Alertas climáticas", desc: "Avisos de riesgo en ruta priorizados por impacto (RF-07/08)." },
  { icon: BarChart3, title: "Reportes operativos", desc: "Desempeño logístico y cumplimiento por zona (RF-10)." },
  { icon: ShieldCheck, title: "Seguridad 2FA", desc: "Acceso protegido con autenticación de dos factores (RNF-03)." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Truck className="size-6 text-emerald-400" />
          Eco<span className="text-emerald-400">Route</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/track"
            className={cn(buttonVariants({ variant: "ghost" }), "text-white hover:bg-white/10 hover:text-white")}
          >
            Rastrear pedido
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants(), "bg-emerald-500 hover:bg-emerald-600 text-white")}
          >
            Acceder
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 text-emerald-300 px-4 py-1.5 text-sm font-medium mb-6 border border-emerald-500/30">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          Transportes Sur-Austral · Santiago ⇄ Punta Arenas
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Logística inteligente,{" "}
          <span className="text-emerald-400">de extremo a extremo</span>
        </h1>
        <p className="mt-6 text-lg text-slate-300 max-w-2xl">
          EcoRoute Logistic AI digitaliza la operación de una flota de 150
          camiones: asignación automática, GPS en tiempo real, trazabilidad para
          el cliente y apoyo a decisiones. Adiós a las planillas y las llamadas.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg" }), "bg-emerald-500 hover:bg-emerald-600 text-white text-base")}
          >
            Ingresar al panel <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/track"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white text-base")}
          >
            <PackageSearch className="size-4" /> Soy cliente
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 max-w-6xl mx-auto w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
            >
              <f.icon className="size-7 text-emerald-400 mb-3" />
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-slate-300 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-slate-400 py-6 border-t border-white/10">
        EcoRoute Logistic AI · Proyecto Ingeniería de Software RQY1102 · 2026
      </footer>
    </div>
  );
}
