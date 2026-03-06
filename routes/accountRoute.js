// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
// Añade esto arriba con los otros "Needed Resources"
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegister));

// Ruta actualizada con los "guardaespaldas"
router.post(
  "/register",
  regValidate.registationRules(), // Paso 1: Cargar las reglas
  regValidate.checkRegData,       // Paso 2: Revisar si hubo errores
  utilities.handleErrors(accountController.registerAccount) // Paso 3: Registrar
)

module.exports = router;