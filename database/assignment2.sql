-- 1. ¿A dónde va? A la tabla public.account
-- 2. ¿Qué columnas llenaremos? Las que no son automáticas
INSERT INTO public.account (
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password
)
-- 3. ¿Qué datos pondremos? (Respetando el mismo orden de arriba)
VALUES (
    'Tony', 
    'Stark', 
    'tony@starkent.com', 
    'Iam1ronM@n'
);

2. Ahora, actualizaremos el tipo de cuenta de Tony Stark a 'Admin'
-- Actualiza la tabla de cuentas
UPDATE public.account
-- Define el nuevo valor: cambiamos el tipo a 'Admin'
SET account_type = 'Admin'
-- Filtro de seguridad: SOLO afecta al registro cuyo ID es 1 (Tony Stark)
WHERE account_id = 1;

3.  
-- Borra de la tabla account
DELETE FROM public.account
-- Específicamente el registro de Tony
WHERE account_id = 1;

4. 
-- 1. ¿A qué tabla vamos? Primero "entramos" a la tabla de inventario
UPDATE public.inventory
-- 2. ¿Qué columna vamos a modificar? La columna de descripción
-- Aquí usamos REPLACE: (Donde buscar, qué buscar, por qué cambiarlo)
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
-- 3. ¿A qué fila exactamente? Filtramos por marca y modelo
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


5.  encuentra todos los vehículos que son de la clasificación 'Sport' y muestra su marca, modelo.
-- 1. Seleccionamos columnas de ambas tablas
SELECT inv_make, inv_model, classification_name
-- 2. ¿De qué tabla empezamos?
FROM public.inventory
-- 3. ¿Con qué tabla la unimos?
INNER JOIN public.classification
-- 4. ¿Cuál es el puente? (Donde el ID de categoría es igual en ambas)
ON public.inventory.classification_id = public.classification.classification_id
-- 5. Filtro: solo los que son 'Sport'
WHERE classification_name = 'Sport';

6: Actualización Masiva . Tienes que arreglar las rutas de las imágenes porque se decidió moverlas a una subcarpeta llamada /vehicles/

-- Actualizamos la tabla de inventario completa
UPDATE public.inventory
SET 
  -- Cambiamos '/images/' por '/images/vehicles/' en la imagen grande
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  -- Hacemos lo mismo para la imagen miniatura (thumbnail)
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');