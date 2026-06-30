"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Map,
  PackagePlus,
  ClipboardList,
  TriangleAlert,
  BarChart3,
  Truck,
  Boxes,
  ScrollText,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile, Rol } from "@/lib/types";

const navOperacion = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "soporte"] },
  { href: "/app/mapa", label: "Mapa GPS", icon: Map, roles: ["admin", "soporte"] },
  { href: "/app/asignar", label: "Asignar cargas", icon: PackagePlus, roles: ["admin"] },
  { href: "/app/despachos", label: "Despachos", icon: ClipboardList, roles: ["admin", "soporte"] },
  { href: "/app/flota", label: "Flota", icon: Boxes, roles: ["admin", "soporte"] },
  { href: "/app/alertas", label: "Alertas", icon: TriangleAlert, roles: ["admin", "soporte"] },
  { href: "/app/reportes", label: "Reportes", icon: BarChart3, roles: ["admin", "soporte"] },
  { href: "/app/bitacora", label: "Bitácora", icon: ScrollText, roles: ["admin", "soporte"] },
];

const navConductor = [
  { href: "/app/conductor", label: "Mi ruta", icon: Truck, roles: ["admin", "conductor", "soporte"] },
];

const navCuenta = [
  { href: "/app/seguridad", label: "Seguridad (2FA)", icon: ShieldCheck, roles: ["admin", "conductor", "soporte"] },
];

function visible<T extends { roles: string[] }>(items: T[], rol: Rol): T[] {
  return items.filter((i) => i.roles.includes(rol));
}

export function AppSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const rol = profile.rol;

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  const initials = profile.nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const Group = ({ label, items }: { label: string; items: typeof navOperacion }) => {
    const list = visible(items, rol);
    if (!list.length) return null;
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarMenu>
          {list.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={isActive(item.href)}
                tooltip={item.label}
                render={<Link href={item.href} />}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5 font-extrabold text-lg">
          <Truck className="size-6 text-orange-600" />
          <span>
            Eco<span className="text-orange-600">Route</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Group label="Operación" items={navOperacion} />
        <Group label="Terreno" items={navConductor} />
        <Group label="Cuenta" items={navCuenta} />
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-orange-600 text-white text-sm font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{profile.nombre}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">{rol}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={logout}
            title="Cerrar sesión"
          >
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
