"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { agregarCamion, agregarConductor } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export function FormCamion() {
  const router = useRouter();
  const [patente, setPatente] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("general");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await agregarCamion({ patente, modelo, tipo });
    setLoading(false);
    if (r.ok) {
      toast.success(`Camión ${patente.toUpperCase()} agregado`);
      setPatente("");
      setModelo("");
      router.refresh();
    } else toast.error("No se pudo agregar", { description: r.error });
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-4 sm:items-end">
      <div className="space-y-1.5">
        <Label>Patente</Label>
        <Input value={patente} onChange={(e) => setPatente(e.target.value)} placeholder="ABCD-12" required />
      </div>
      <div className="space-y-1.5">
        <Label>Modelo</Label>
        <Input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Volvo FH" />
      </div>
      <div className="space-y-1.5">
        <Label>Tipo</Label>
        <select className={selectClass} value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="general">General</option>
          <option value="refrigerada">Refrigerada</option>
          <option value="peligrosa">Peligrosa</option>
        </select>
      </div>
      <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        Agregar camión
      </Button>
    </form>
  );
}

export function FormConductor() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [licencia, setLicencia] = useState("A-4");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await agregarConductor({ nombre, licencia });
    setLoading(false);
    if (r.ok) {
      toast.success(`Conductor ${nombre} agregado`);
      setNombre("");
      router.refresh();
    } else toast.error("No se pudo agregar", { description: r.error });
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-4 sm:items-end">
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Nombre</Label>
        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Juan Pérez" required />
      </div>
      <div className="space-y-1.5">
        <Label>Licencia</Label>
        <select className={selectClass} value={licencia} onChange={(e) => setLicencia(e.target.value)}>
          {["A-1", "A-2", "A-3", "A-4", "A-5"].map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        Agregar conductor
      </Button>
    </form>
  );
}
