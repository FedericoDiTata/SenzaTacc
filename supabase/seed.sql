-- ============================================================================
-- Senza Tacc — carga inicial del catálogo (41 productos)
-- GENERADO por scripts/generar-seed-sql.ts — no editar a mano.
-- Para cambiar el catálogo: editar lib/seed.ts y volver a correr el script.
--
-- Correr DESPUÉS de schema.sql. Es idempotente: vuelve a dejar el catálogo
-- como está en el código, incluidos precios y stock de demo.
-- ============================================================================

insert into productos
  (id, nombre, marca, descripcion, categoria, imagen, precio, unidad,
   stock, reservado, stock_minimo, destacado, activo, orden)
values
  ('schar-choco-chip-cookies', 'Choco Chip Cookies', 'Schär', 'Galletitas con chips de chocolate. El clásico de la góndola.', 'galletitas', '/productos/schar-choco-chip-cookies.jpg', 7400, '200 g', 18, 0, 4, true, true, 1),
  ('oreo-sin-gluten', 'Oreo Sin Gluten', 'Oreo', 'Las de siempre, ahora aptas. Relleno sabor vainilla.', 'galletitas', '/productos/oreo-sin-gluten.jpg', 3400, '95 g', 24, 0, 6, true, true, 2),
  ('schar-wafers-vainilla', 'Wafers alla Vaniglia', 'Schär', 'Obleas rellenas de crema de vainilla.', 'galletitas', '/productos/schar-wafers-vainilla.jpg', 4800, '125 g', 12, 0, 4, false, true, 3),
  ('schar-mini-sorrisi', 'Mini Sorrisi', 'Schär', 'Galletitas de cacao rellenas con 33% de crema de leche.', 'galletitas', '/productos/schar-mini-sorrisi.jpg', 5600, '100 g', 9, 0, 4, false, true, 4),
  ('schar-snack-chocolate', 'Snack Milk Chocolate', 'Schär', 'Obleas con avellanas bañadas en chocolate con leche. Pack x3.', 'galletitas', '/productos/schar-snack-chocolate.jpg', 5200, '105 g · 3 u.', 3, 0, 4, false, true, 5),
  ('kapac-vainillas', 'Vainillas', 'Kapac', 'Para el café con leche o para armar un postre.', 'galletitas', '/productos/kapac-vainillas.jpg', 3900, '200 g', 15, 0, 4, false, true, 6),
  ('angiola-limon-chocolate', 'Galletitas de limón bañadas en chocolate', 'Angiola', 'Sabor limón con baño de chocolate.', 'galletitas', '/productos/angiola-limon-chocolate.jpg', 6200, '130 g', 7, 0, 3, false, true, 7),
  ('celienergy-cacao-mani', 'Galletitas de cacao y maní', 'Celienergy', 'Con harina de maní.', 'galletitas', '/productos/celienergy-cacao-mani.jpg', 3700, '130 g', 14, 0, 4, false, true, 8),
  ('doninas-chia-limon', 'Galletitas de chía y limón', 'Doninas', 'Sin azúcar agregada, con esencia natural de limón y stevia.', 'galletitas', '/productos/doninas-chia-limon.jpg', 4100, '150 g', 11, 0, 4, false, true, 9),
  ('doninas-amapola-naranja', 'Galletitas de amapola y naranja', 'Doninas', 'Sin azúcar agregada.', 'galletitas', '/productos/doninas-amapola-naranja.jpg', 4100, '150 g', 10, 0, 4, false, true, 10),
  ('rraac-rellenas-chocolate', 'Galletitas rellenas de chocolate', 'Rraac', 'Tapas de vainilla con relleno sabor chocolate. 100% vegetal.', 'galletitas', '/productos/rraac-rellenas-chocolate.jpg', 3200, '90 g', 16, 0, 4, false, true, 11),
  ('snuks-almohaditas-frutilla', 'Almohaditas rellenas de frutilla', 'Snuks', 'Para el desayuno o para picar.', 'galletitas', '/productos/snuks-almohaditas-frutilla.jpg', 2600, '50 g', 0, 0, 4, false, true, 12),
  ('dantelli-alfajor-ddl', 'Alfajor de dulce de leche', 'Dantelli', 'Relleno de dulce de leche con baño de chocolate semiamargo.', 'alfajores', '/productos/dantelli-alfajor-ddl.jpg', 1900, '50 g', 32, 0, 8, true, true, 20),
  ('dantelli-ddl-mousse-x3', 'Alfajor triple dulce de leche y mousse de vainilla', 'Dantelli', 'Tres capas. Dulce de leche y mousse de vainilla.', 'alfajores', '/productos/dantelli-ddl-mousse-x3.jpg', 4500, '100 g', 13, 0, 4, false, true, 21),
  ('smams-alfajor-ddl', 'Alfajor con dulce de leche', 'Smams', 'Baño de repostería semiamargo.', 'alfajores', '/productos/smams-alfajor-ddl.jpg', 1700, '50 g', 28, 0, 8, false, true, 22),
  ('smams-alfajor-triple', 'Alfajor triple', 'Smams', 'Triple, con mousse y dulce de leche.', 'alfajores', '/productos/smams-alfajor-triple.jpg', 2900, 'unidad', 19, 0, 6, false, true, 23),
  ('lulemuu-alfajor-arroz', 'Alfajor de arroz con dulce de leche', 'Lulemuu', 'Liviano, de galleta de arroz. Ideal para la mochila.', 'alfajores', '/productos/lulemuu-alfajor-arroz.jpg', 1500, '26 g', 41, 0, 10, true, true, 24),
  ('crudda-brownie', 'Crudda Bar Brownie', 'Crudda', 'Proteína de arveja, quinoa, pasta de maní y cacao. Sin conservantes.', 'barritas', '/productos/crudda-brownie.jpg', 3600, '40 g', 22, 0, 6, true, true, 30),
  ('crudda-peanut-caramel', 'Crudda Bar Peanut Caramel', 'Crudda', '9 g de proteína y 7 g de fibra. A base de plantas.', 'barritas', '/productos/crudda-peanut-caramel.jpg', 3600, '40 g', 20, 0, 6, false, true, 31),
  ('crudda-arandanos-nuez', 'Crudda Bar Arándanos y Nuez', 'Crudda', 'Con baño de repostería sabor arándanos.', 'barritas', '/productos/crudda-arandanos-nuez.jpg', 3600, '40 g', 5, 0, 6, false, true, 32),
  ('bravisima-barra-proteica', 'Bravísima y Proteica', 'Bravísima', '15 g de proteína. Proteína de arveja, dátiles y chocolate semiamargo.', 'barritas', '/productos/bravisima-barra-proteica.jpg', 4900, '58 g', 17, 0, 5, false, true, 33),
  ('merlin-bars-cafe-protein', 'Merlín Bars Café Protein', 'Merlín Bars', '16 g de proteína vegetal, dátiles, almendras, castañas de cajú y café.', 'barritas', '/productos/merlin-bars-cafe-protein.jpg', 4700, '55 g', 14, 0, 5, false, true, 34),
  ('emm-fit-bar-mani', 'emm! Fit Bar Maní', 'emm!', 'Barrita de maní para media mañana.', 'barritas', '/productos/emm-fit-bar-mani.jpg', 2800, '45 g', 26, 0, 6, false, true, 35),
  ('mudra-armonia', 'Mudra Armonía', 'Mudra', 'Arándanos, nueces y canela. Endulzada con miel.', 'barritas', '/productos/mudra-armonia.jpg', 2400, '35 g', 23, 0, 6, false, true, 36),
  ('mudra-bienestar', 'Mudra Bienestar', 'Mudra', 'Manzana, arándanos y jengibre. Sin azúcar agregada.', 'barritas', '/productos/mudra-bienestar.jpg', 2600, '40 g', 21, 0, 6, false, true, 37),
  ('johnnys-barra-caju', 'Barra de frutos secos con castañas de cajú', 'Johnny''s Market', 'Con azúcar orgánica. Sin aditivos ni conservantes.', 'barritas', '/productos/johnnys-barra-caju.jpg', 3300, '30 g', 12, 0, 5, false, true, 38),
  ('laddubar-gold-almendras', 'Laddubar Gold Almendras', 'Laddubar', 'Dátiles, almendras y cacao. Raw y vegana.', 'barritas', '/productos/laddubar-gold-almendras.jpg', 2700, '30 g', 18, 0, 5, false, true, 39),
  ('food-alchimist-trufa-datiles', 'Trufa de dátiles y maní', 'The Food Alchimist', 'A base de dátiles y frutos secos. Kosher.', 'barritas', '/productos/food-alchimist-trufa-datiles.jpg', 1800, '20 g', 30, 0, 8, false, true, 40),
  ('mani-king-salado', 'Maní salado sin piel', 'Maní King', '100% maní alto oleico. Para compartir.', 'snacks', '/productos/mani-king-salado.jpg', 6800, '350 g', 16, 0, 4, true, true, 50),
  ('mani-king-tostado', 'Maní tostado sin piel', 'Maní King', 'Sin sodio. 100% maní alto oleico.', 'snacks', '/productos/mani-king-tostado.jpg', 6800, '350 g', 13, 0, 4, false, true, 51),
  ('mani-king-limon-pimienta', 'Maní sabor limón y pimienta', 'Maní King', 'De la línea Chef.', 'snacks', '/productos/mani-king-limon-pimienta.jpg', 2200, '80 g', 27, 0, 6, false, true, 52),
  ('schar-grissini', 'Grissini', 'Schär', 'Crocantes y friables. Tres paquetes individuales.', 'snacks', '/productos/schar-grissini.jpg', 6100, '150 g · 3 u.', 11, 0, 4, true, true, 53),
  ('lennys-pita-chips-sal', 'Pita Chips sal marina', 'Lenny''s', 'Ultrafinas y horneadas.', 'snacks', '/productos/lennys-pita-chips-sal.jpg', 4300, '100 g', 8, 0, 4, false, true, 54),
  ('carilo-grisines-arvejas', 'Mini grisines de arroz sabor arvejas', 'Productos Cariló', 'Extruido de harina de arveja y harina de arroz.', 'snacks', '/productos/carilo-grisines-arvejas.jpg', 3100, '100 g', 15, 0, 4, false, true, 55),
  ('crisppino-minis-jamon', 'Crisppino Minis sabor jamón', 'Crisppino', 'Snacks de arroz salados.', 'snacks', '/productos/crisppino-minis-jamon.jpg', 2300, '50 g', 2, 0, 5, false, true, 56),
  ('dona-rosa-tirabuzon', 'Tirabuzón', 'Doña Rosa', 'Pastas de maíz y arroz. Fideos secos al huevo.', 'pastas', '/productos/dona-rosa-tirabuzon.jpg', 4900, '500 g', 20, 0, 5, true, true, 60),
  ('dona-rosa-tirabuzon-multivegetal', 'Tirabuzón multivegetal', 'Doña Rosa', 'Tricolor, de maíz y arroz.', 'pastas', '/productos/dona-rosa-tirabuzon-multivegetal.jpg', 5400, '500 g', 14, 0, 5, false, true, 61),
  ('dona-rosa-multivegetales', 'Fideos secos multivegetales', 'Doña Rosa', 'Cintas de maíz y arroz.', 'pastas', '/productos/dona-rosa-multivegetales.jpg', 4700, '400 g', 9, 0, 5, false, true, 62),
  ('blue-patna-coditos', 'Coditos de arroz', 'Blue Patna', 'Pastas secas de harina de arroz con huevo.', 'pastas', '/productos/blue-patna-coditos.jpg', 4200, '500 g', 22, 0, 5, false, true, 63),
  ('blue-patna-mostacholes', 'Mostacholes de arroz', 'Blue Patna', 'Pastas secas de harina de arroz con huevo.', 'pastas', '/productos/blue-patna-mostacholes.jpg', 4200, '500 g', 19, 0, 5, false, true, 64),
  ('soyarroz-fideos-espinaca', 'Fideos de arroz con espinaca', 'Soyarroz', 'Tipo fideo seco, a base de arroz.', 'pastas', '/productos/soyarroz-fideos-espinaca.jpg', 3900, '300 g', 10, 0, 5, false, true, 65)
on conflict (id) do update set
  nombre       = excluded.nombre,
  marca        = excluded.marca,
  descripcion  = excluded.descripcion,
  categoria    = excluded.categoria,
  imagen       = excluded.imagen,
  precio       = excluded.precio,
  unidad       = excluded.unidad,
  stock        = excluded.stock,
  reservado    = excluded.reservado,
  stock_minimo = excluded.stock_minimo,
  destacado    = excluded.destacado,
  activo       = excluded.activo,
  orden        = excluded.orden;
