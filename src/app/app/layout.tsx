import { redirect } from "next/navigation";
import { getProfile } from "@/lib/queries";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium text-muted-foreground">
            EcoRoute Logistic AI · Transportes Sur-Austral
          </span>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">{profile.nombre}</p>
              <p className="mt-0.5 text-xs capitalize text-muted-foreground">{profile.rol}</p>
            </div>
            <div className="grid size-8 place-items-center rounded-full bg-orange-600 text-xs font-bold text-white">
              {profile.nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 bg-muted/30 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
