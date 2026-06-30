-- ============================================================
-- RPCs de operación: actualización de estado (RF-05) y reporte de incidencias
-- SECURITY DEFINER para permitir al conductor operar sin ampliar RLS.
-- ============================================================

create or replace function public.actualizar_estado_despacho(
  p_id bigint,
  p_estado estado_despacho
)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.despachos
     set estado = p_estado,
         fecha_entrega = case when p_estado = 'entregado' then now() else fecha_entrega end
   where id = p_id;

  insert into public.bitacora (usuario, accion, entidad, detalle)
  values (
    coalesce((select email from auth.users where id = auth.uid()), 'sistema'),
    'actualizacion_estado',
    'despacho',
    format('Despacho %s -> %s', p_id, p_estado)
  );
end; $$;

grant execute on function public.actualizar_estado_despacho(bigint, estado_despacho)
  to authenticated;

create or replace function public.reportar_incidencia(
  p_despacho_id bigint,
  p_titulo text,
  p_descripcion text
)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_ruta bigint;
begin
  select ruta_id into v_ruta from public.despachos where id = p_despacho_id;

  insert into public.alertas (tipo, severidad, titulo, descripcion, ruta_id, despacho_id, activa)
  values ('incidencia', 'media', p_titulo, p_descripcion, v_ruta, p_despacho_id, true);

  insert into public.bitacora (usuario, accion, entidad, detalle)
  values (
    coalesce((select email from auth.users where id = auth.uid()), 'sistema'),
    'reporte_incidencia',
    'alerta',
    format('Incidencia en despacho %s: %s', p_despacho_id, p_titulo)
  );
end; $$;

grant execute on function public.reportar_incidencia(bigint, text, text)
  to authenticated;
