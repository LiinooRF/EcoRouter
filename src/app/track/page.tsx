import Link from "next/link";
import { TrackClient } from "./track-client";
import { Truck } from "lucide-react";

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between bg-slate-950 px-6 py-4 text-white">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <Truck className="size-5 text-orange-400" />
          Eco<span className="text-orange-400">Route</span> · Seguimiento
        </Link>
        <Link href="/login" className="text-sm text-slate-300 hover:text-white">
          Acceso interno →
        </Link>
      </header>

      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-2xl font-bold">Rastrea tu pedido</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ingresa tu número de guía para ver el estado de tu despacho en tiempo
          real (RF-04).
        </p>
        <div className="mt-6">
          <TrackClient />
        </div>
      </main>
    </div>
  );
}
