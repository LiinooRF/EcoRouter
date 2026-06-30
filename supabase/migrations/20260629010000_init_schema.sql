-- ============================================================
-- EcoRoute Logistic AI — Esquema inicial
-- Derivado del diagrama de clases (EP2.2 / modelo 4+1)
-- ============================================================

-- ---------- ENUMS ----------
create type rol_usuario       as enum ('admin','conductor','cliente','soporte');
create type estado_despacho   as enum ('en_preparacion','en_transito','en_aduana','retrasado','entregado');
create type estado_operativo  as enum ('activo','mantencion','inactivo');
create type tipo_licencia      as enum ('A-1','A-2','A-3','A-4','A-5');
create type tipo_alerta        as enum ('clima','retraso','detencion','incidencia','mantencion');
create type severidad_alerta   as enum ('critica','media','info');
create type tipo_carga         as enum ('general','refrigerada','peligrosa');

-- ---------- PROFILES (extiende auth.users) ----------
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  nombre       text not null,
  email        text,
  rol          rol_usuario not null default 'soporte',
  area         text,
  nivel_acceso int default 1,
  telefono     text,
  created_at   timestamptz default now()
);

-- ---------- CAMIONES ----------
create table public.camiones (
  id               bigint generated always as identity primary key,
  patente          text unique not null,
  modelo           text,
  tipo             tipo_carga default 'general',
  estado_operativo estado_operativo default 'activo',
  created_at       timestamptz default now()
);

-- ---------- CONDUCTORES ----------
create table public.conductores (
  id         bigint generated always as identity primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  nombre     text not null,
  licencia   tipo_licencia not null,
  disponible boolean default true,
  camion_id  bigint references public.camiones(id) on delete set null,
  created_at timestamptz default now()
);

-- ---------- RUTAS ----------
create table public.rutas (
  id           bigint generated always as identity primary key,
  origen       text not null,
  destino      text not null,
  distancia_km int  not null,
  created_at   timestamptz default now()
);

-- ---------- DESPACHOS ----------
create table public.despachos (
  id             bigint generated always as identity primary key,
  numero_guia    text unique not null,
  cliente_nombre text,
  estado         estado_despacho not null default 'en_preparacion',
  conductor_id   bigint references public.conductores(id) on delete set null,
  camion_id      bigint references public.camiones(id) on delete set null,
  ruta_id        bigint references public.rutas(id) on delete set null,
  tipo_carga     tipo_carga default 'general',
  fecha_creacion timestamptz default now(),
  fecha_estimada date,
  fecha_entrega  timestamptz,
  created_at     timestamptz default now()
);

-- ---------- VIATICOS (1:1 con despacho, RF-06) ----------
create table public.viaticos (
  id          bigint generated always as identity primary key,
  despacho_id bigint unique references public.despachos(id) on delete cascade,
  combustible numeric(12,0) default 0,
  peajes      numeric(12,0) default 0,
  monto_total numeric(12,0) generated always as (combustible + peajes) stored
);

-- ---------- ALERTAS (RF-07 / RF-08) ----------
create table public.alertas (
  id          bigint generated always as identity primary key,
  tipo        tipo_alerta not null,
  severidad   severidad_alerta not null default 'info',
  titulo      text not null,
  descripcion text,
  ruta_id     bigint references public.rutas(id) on delete set null,
  despacho_id bigint references public.despachos(id) on delete set null,
  activa      boolean default true,
  fecha_hora  timestamptz default now()
);

-- ---------- POSICIONES GPS (RF-03) ----------
create table public.posiciones_gps (
  id            bigint generated always as identity primary key,
  camion_id     bigint references public.camiones(id) on delete cascade,
  lat           double precision not null,
  lng           double precision not null,
  velocidad     int default 0,
  registrado_at timestamptz default now()
);

-- ---------- BITACORA (RNF-10 trazabilidad) ----------
create table public.bitacora (
  id         bigint generated always as identity primary key,
  usuario    text,
  accion     text not null,
  entidad    text,
  detalle    text,
  created_at timestamptz default now()
);

-- ============================================================
-- FUNCIONES
-- ============================================================

-- Crea automáticamente un profile al registrarse un usuario en auth.users
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nombre, email, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email,'@',1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'rol')::rol_usuario, 'soporte')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Rol del usuario actual (helper para RLS)
create or replace function public.mi_rol()
returns rol_usuario language sql stable security definer set search_path = public as $$
  select rol from public.profiles where id = auth.uid();
$$;

-- RPC pública para el Portal del Cliente (RF-04): consulta acotada por número de guía
create or replace function public.consultar_despacho(p_guia text)
returns table (
  numero_guia    text,
  estado         estado_despacho,
  cliente_nombre text,
  origen         text,
  destino        text,
  conductor      text,
  fecha_estimada date,
  fecha_entrega  timestamptz
) language sql security definer set search_path = public as $$
  select d.numero_guia, d.estado, d.cliente_nombre,
         r.origen, r.destino, c.nombre,
         d.fecha_estimada, d.fecha_entrega
  from public.despachos d
  left join public.rutas r       on r.id = d.ruta_id
  left join public.conductores c on c.id = d.conductor_id
  where upper(d.numero_guia) = upper(trim(p_guia));
$$;

grant execute on function public.consultar_despacho(text) to anon, authenticated;
grant execute on function public.mi_rol() to authenticated;

-- ============================================================
-- ROW LEVEL SECURITY (RNF-03)
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.camiones        enable row level security;
alter table public.conductores     enable row level security;
alter table public.rutas           enable row level security;
alter table public.despachos       enable row level security;
alter table public.viaticos        enable row level security;
alter table public.alertas         enable row level security;
alter table public.posiciones_gps  enable row level security;
alter table public.bitacora        enable row level security;

-- profiles: lectura autenticada; cada quien edita el suyo
create policy "auth read profiles"  on public.profiles for select to authenticated using (true);
create policy "own profile update"  on public.profiles for update to authenticated using (auth.uid() = id);

-- Tablas operativas: lectura para autenticados + escritura para admin/soporte
do $$
declare t text;
begin
  foreach t in array array['camiones','conductores','rutas','despachos','viaticos','alertas','posiciones_gps','bitacora']
  loop
    execute format('create policy "auth read %1$s" on public.%1$s for select to authenticated using (true);', t);
    execute format('create policy "admin write %1$s" on public.%1$s for all to authenticated using (public.mi_rol() in (''admin'',''soporte'')) with check (public.mi_rol() in (''admin'',''soporte''));', t);
  end loop;
end $$;
