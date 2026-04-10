
/* ******************************************
 * static.js - Pasillo de Autoservicio (Suministros)
 * Este archivo entrega materiales visuales sin necesidad de lógica.
 *******************************************/

const express = require('express');
const router = express.Router(); // Crea el "Sub-Mapa" exclusivo para este pasillo de suministros.

// --- CONFIGURACIÓN DE ESTANTES (Rutas Estáticas) ---

// Abre la puerta del almacén principal "public" para que el cliente tome lo que necesite.
router.use(express.static("public"));

// Estante de Pintura y Decoración: Entrega los archivos de estilo para que la web tenga color.
router.use("/css", express.static(__dirname + "public/css"));

// Estante de Refacciones Eléctricas: Entrega los scripts que dan interactividad a la página.
router.use("/js", express.static(__dirname + "public/js"));

// Estante de Cuadros y Fotos: Entrega las imágenes de los autos y logos de la empresa.
router.use("/images", express.static(__dirname + "public/images"));


// --- CONEXIÓN AL TABLERO CENTRAL ---

// "Enchufa" este pasillo al servidor principal (server.js) para que sea accesible.
module.exports = router;