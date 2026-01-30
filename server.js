/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements (Traer las herramientas)
 *************************/
const express = require("express") // Trae el framework web principal
const expressLayouts = require("express-ejs-layouts") // Trae el sistema para usar plantillas
const env = require("dotenv").config() // Abre la "caja fuerte" de las variables secretas
const app = express() // Crea la aplicación (el cerebro del servidor)
const static = require("./routes/static") // Trae las reglas para archivos fijos (CSS, imágenes)

/* ***********************
 * View Engine and Templates (Configurar la apariencia)
 *************************/
app.set("view engine", "ejs") // Dice que usaremos EJS para crear las páginas
app.use(expressLayouts) // Activa el uso de capas o diseños modulares
app.set("layout", "./layouts/layout") // Indica cuál es el diseño maestro de la web

/* ***********************
 * Routes (Definir los caminos)
 *************************/
app.use(static) // Le dice al servidor que use las rutas de archivos estáticos
// Index route
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})
/* ***********************
 * Local Server Information (Leer datos de la caja fuerte)
 *************************/
const port = process.env.PORT // Lee el número de puerto desde el archivo .env
const host = process.env.HOST // Lee la dirección del host desde el archivo .env

/* ***********************
 * Log statement (Encender y avisar)
 *************************/
app.listen(port, () => { // Pone al servidor a escuchar visitas en el puerto indicado
  console.log(`app listening on ${host}:${port}`) // Muestra un mensaje para confirmar que funciona
})