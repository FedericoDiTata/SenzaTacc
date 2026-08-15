-- ============================================================================
-- Senza Tacc — pedidos de demostración (3)
-- GENERADO por scripts/generar-seed-sql.ts — no editar a mano.
--
-- OPCIONAL, pero muy recomendable antes de mostrar la demo: un panel vacío no
-- vende. Correr DESPUÉS de seed.sql.
--
-- Ojo: NO es idempotente (el código de pedido es único). Para volver a
-- cargarlos hay que borrar los anteriores:
--   delete from pedidos where codigo in ('K7M2', 'R4XP', 'B9TQ');
--   -- y devolver las reservas:
--   update productos set reservado = 0;
-- ============================================================================

select crear_pedido(
  'K7M2',
  'Carolina Benítez',
  '+54 9 11 5312-8840',
  '[{"productoId":"dantelli-alfajor-ddl","nombre":"Alfajor de dulce de leche","marca":"Dantelli","unidad":"50 g","precioUnitario":1900,"cantidad":4},{"productoId":"dona-rosa-tirabuzon","nombre":"Tirabuzón","marca":"Doña Rosa","unidad":"500 g","precioUnitario":4900,"cantidad":2},{"productoId":"crudda-brownie","nombre":"Crudda Bar Brownie","marca":"Crudda","unidad":"40 g","precioUnitario":3600,"cantidad":3}]'::jsonb,
  'Paso a buscarlo hoy a la tarde, tipo 18 h.',
  24
);
update pedidos
   set creado_en = now() - interval '11 minutes'
 where codigo = 'K7M2';

select crear_pedido(
  'R4XP',
  'Martín Sosa',
  '+54 9 11 6027-3915',
  '[{"productoId":"schar-choco-chip-cookies","nombre":"Choco Chip Cookies","marca":"Schär","unidad":"200 g","precioUnitario":7400,"cantidad":1},{"productoId":"oreo-sin-gluten","nombre":"Oreo Sin Gluten","marca":"Oreo","unidad":"95 g","precioUnitario":3400,"cantidad":3},{"productoId":"mani-king-salado","nombre":"Maní salado sin piel","marca":"Maní King","unidad":"350 g","precioUnitario":6800,"cantidad":1}]'::jsonb,
  '',
  24
);
update pedidos
   set creado_en = now() - interval '47 minutes'
 where codigo = 'R4XP';

select crear_pedido(
  'B9TQ',
  'Lucía Ramírez',
  '+54 9 11 4488-2201',
  '[{"productoId":"lulemuu-alfajor-arroz","nombre":"Alfajor de arroz con dulce de leche","marca":"Lulemuu","unidad":"26 g","precioUnitario":1500,"cantidad":6},{"productoId":"mudra-armonia","nombre":"Mudra Armonía","marca":"Mudra","unidad":"35 g","precioUnitario":2400,"cantidad":2},{"productoId":"schar-grissini","nombre":"Grissini","marca":"Schär","unidad":"150 g · 3 u.","precioUnitario":6100,"cantidad":1}]'::jsonb,
  '¿Tenés más variedad de barritas? Si hay de arándanos sumame dos.',
  24
);
update pedidos
   set creado_en = now() - interval '143 minutes'
 where codigo = 'B9TQ';
