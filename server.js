/* ******************************************
 * server.js - El Plano Maestro (Archivo Principal)
 * Este archivo es el "Cerebro" que orquestra todo.
 *******************************************/

/* ***********************
 * Herramientas Externas (Dependencies)
 * Estas son piezas que compramos afuera para que el edificio funcione.
 *************************/
const express = require("express") // El Framework: Provee los métodos (GET/POST) para que el servidor responda.  // es el Plano Arquitectónico de la concesionaria. Es solo papel y tinta.
const expressLayouts = require("express-ejs-layouts") // El Motor de Plantillas: Permite reutilizar el mismo diseño (Header/Footer).
const env = require("dotenv").config() // Variables de Entorno: Lee el archivo .env para no exponer datos sensibles.
const app = express() // La Instancia: Crea el objeto "app" que representa a nuestro servidor vivo. es el momento en que el edificio se materializa en el terreno.
const cookieParser = require("cookie-parser")

/* ***********************
 * Empleados Internos (Routes & Controllers)
 * Estos son los archivos que tú mismo creaste en tus carpetas.
 *************************/
// no se llaman a las otras subcarpetas por que no son esenciales para el home view sino para una parte especifica segun el usuario lo requiera

const static = require("./routes/static") // Ruta Estática: Maneja archivos que no cambian (CSS, JS del cliente, Imágenes).
const baseController = require("./controllers/baseController") // Controlador Base: Contiene la lógica para la página de inicio.
const inventoryRoute = require("./routes/inventoryRoute") // Ruta de Inventario: El pasillo que lleva a todo lo de los autos.
const accountRoute = require("./routes/accountRoute") // Ruta de Cuentas: El pasillo para registros y perfiles de usuario.
const utilities = require("./utilities/") // Utilidades: Funciones de apoyo que se usan en todo el proyecto.


/* ***********************
 * Servicios de Infraestructura (Database & Communication)
 * Conexiones técnicas para que los datos fluyan.
 *************************/
const session = require("express-session") // Sesiones: Permite que el servidor "recuerde" al cliente entre páginas.
const pool = require('./database/') // Pool de Conexión: El cableado físico hacia la base de datos PostgreSQL.
const bodyParser = require("body-parser") // Body Parser: Traduce los datos que vienen de formularios a formato JSON (req.body).


/* ***********************
 * Configuración de la "Sala de Exhibición" (View Engine)
 *************************/
app.set("view engine", "ejs") // Define EJS como el lenguaje para generar el HTML.
app.use(expressLayouts) // Le dice a la app que use el sistema de capas (Layouts).
app.set("layout", "./layouts/layout") // Establece cuál es el archivo que sirve de "marco" principal.


/* ***********************
 * Servicios en Segundo Plano (Middleware)
 * Procesos que ocurren automáticamente antes de llegar a las rutas.
 *************************/
// Gestión de Sesión: Guarda los "gafetes" de los clientes en la base de datos.
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Mensajes Flash: Permite enviar notificaciones temporales (ej: "Registro exitoso").
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Traductor de Datos: Hace que la información de los formularios sea legible para JavaScript.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use(cookieParser())

app.use(utilities.checkJWTToken)
/* ***********************
 * Los Pasillos Principales (Routes)
 * Aquí es donde el servidor decide a qué empleado enviar al cliente.
 *************************/
app.use(static) // Pasillo de recursos públicos.

// Ruta de Inicio: Si la URL es "/", el controlador construye la página Home.
app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute) // Si la URL empieza con "/inv", va al departamento de inventario.
app.use("/account", accountRoute) // Si la URL empieza con "/account", va al departamento de usuarios.

// Manejo de Extravío (404): Si el cliente pide una ruta que no existe.
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
 * Protocolo de Emergencia (Error Handler)
 * Si algo se rompe en cualquier parte, este código toma el control.
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav() // El conserje prepara el menú para que el usuario pueda navegar de vuelta.
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message = err.status == 404 ? err.message : 'Oh no! There was a crash.'
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Apertura del Edificio (Listen)
 *************************/
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`) // El servidor empieza a escuchar peticiones.
})