"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ESTADO_LABEL } from "@/lib/format";
import type { EstadoDespacho } from "@/lib/types";
import { ArrowRight, Loader2, Check } from "lucide-react";

const SIGUIENTE: Record<string, EstadoDespacho | null> = {
  en_preparacion: "en_transito",
  en_transito: "en_aduana",
  en_aduana: "entregado",
  retrasado: "en_transito",
  entregado: null,
};

export function AdvanceState({ id, estado }: { id: number; estado: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const sig = SIGUIENTE[estado];

  async function avanzar() {
    if (!sig) return;
    setLoading(true);
    const { error } = await supabase.rpc("actualizar_estado_despacho", {
      p_id: id,
      p_estado: sig,
    });
    setLoading(false);
    if (error) {
      toast.error("No se pudo actualizar", { description: error.message });
      return;
    }
    toast.success(`Estado: ${ESTADO_LABEL[sig]}`);
    router.refresh();
  }

  if (!sig) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
        <Check className="size-4" /> Despacho entregado
      </div>
    );
  }

  return (
    <Button onClick={avanzar} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
      {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
      Avanzar a: {ESTADO_LABEL[sig]}
    </Button>
  );
}
