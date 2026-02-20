// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Traer el archivo de utilidades para poder usar handleErrors
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Ruta para mostrar el detalle de un vehículo específico
router.get("/detail/:invId", utilities.handleErrors(invController.buildItemDetail));

// Ruta para provocar el error intencional de la Task 3
router.get("/trigger-error", utilities.handleErrors(invController.triggerError))

module.exports = router;