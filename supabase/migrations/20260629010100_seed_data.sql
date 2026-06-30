-- ============================================================
-- EcoRoute Logistic AI — Datos semilla (demo)
-- ============================================================

insert into public.rutas (origen, destino, distancia_km) values
  ('Santiago','Punta Arenas',3090),
  ('Santiago','Puerto Montt',1035),
  ('Santiago','Temuco',675),
  ('Santiago','Coyhaique',1640),
  ('Santiago','Valdivia',840),
  ('Santiago','Chillán',400);

insert into public.camiones (patente, modelo, tipo, estado_operativo) values
  ('KXLR-45','Volvo FH',        'general',     'activo'),
  ('JRTV-22','Scania R450',     'refrigerada', 'activo'),
  ('LMNP-78','Mercedes Actros', 'general',     'activo'),
  ('PQRS-11','Volvo FMX',       'peligrosa',   'mantencion'),
  ('TUVW-90','Scania G410',     'general',     'activo');

insert into public.conductores (nombre, licencia, disponible, camion_id) values
  ('Pedro Cárcamo','A-5',true, 1),
  ('Marta Oyarzo', 'A-5',true, 2),
  ('Juan Vera',    'A-4',true, 3),
  ('Rodrigo Soto', 'A-5',false,4),
  ('Luis Díaz',    'A-4',true, 5);

insert into public.despachos (numero_guia, cliente_nombre, estado, conductor_id, camion_id, ruta_id, tipo_carga, fecha_estimada) values
  ('SA-2026-10481','Comercial Andes Ltda.', 'retrasado',   1,1,1,'general',    '2026-06-30'),
  ('SA-2026-10482','Frigorífico Patagonia', 'en_aduana',   4,4,4,'refrigerada','2026-07-01'),
  ('SA-2026-10477','Distribuidora Sur',     'en_transito', 2,2,2,'refrigerada','2026-06-29'),
  ('SA-2026-10470','Ferretería El Roble',   'en_transito', 3,3,3,'general',    '2026-06-29'),
  ('SA-2026-10465','Agrícola Los Ríos',     'entregado',   5,5,6,'general',    '2026-06-28'),
  ('SA-2026-10458','Minera Aysén',          'entregado',   2,2,5,'general',    '2026-06-28');

-- Viáticos por despacho (combustible ≈ km·0,35·$1.050 ; peajes ≈ km·$95)
insert into public.viaticos (despacho_id, combustible, peajes)
select d.id, round(r.distancia_km * 0.35 * 1050), round(r.distancia_km * 95)
from public.despachos d
join public.rutas r on r.id = d.ruta_id;

insert into public.alertas (tipo, severidad, titulo, descripcion, ruta_id, despacho_id, activa) values
  ('clima',     'critica','Nieve intensa — Ruta 9 Sur (Km 2.450)','Afecta unidades hacia Punta Arenas. Riesgo de detención.',1,1,true),
  ('retraso',   'critica','Retraso crítico — Guía SA-2026-10481', 'El despacho supera en 6h el tiempo estimado.',           1,1,true),
  ('detencion', 'media',  'Detención prolongada — Camión PQRS-11', 'Detenido 2h15 en Paso Integración Austral (aduana).',    4,2,true),
  ('clima',     'media',  'Lluvia fuerte — sector Osorno',         'Posible reducción de velocidad en unidades.',            2,3,true),
  ('mantencion','info',   'Mantención programada — Camión LMNP-78','Próxima revisión técnica en 800 km.',                    3,4,true);

-- Posición GPS actual por camión (coordenadas aproximadas en Chile)
insert into public.posiciones_gps (camion_id, lat, lng, velocidad) values
  (1,-53.16,-70.91, 0),   -- zona Punta Arenas
  (2,-41.47,-72.94,88),   -- Puerto Montt
  (3,-38.73,-72.59,76),   -- Temuco
  (4,-51.73,-72.50, 0),   -- aduana sur
  (5,-36.60,-72.10,92);   -- Chillán
