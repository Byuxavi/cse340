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

// Procesa el intento de login
router.post(
  "/login",
  regValidate.loginRules(),     // <-- Paso 1: Valida las reglas
  regValidate.checkLoginData,   // <-- Paso 2: Revisa si hubo errores
  utilities.handleErrors(accountController.accountLogin)
)

// Ruta por defecto para la gestión de la cuenta (Management View)

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Ruta para entregar la vista de actualización de cuenta (GET)
// Se protege con checkLogin para asegurar que solo usuarios reales entren
router.get(
  "/update/:accountId",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Procesar la actualización de datos básicos
router.post(
  "/update-info",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Procesar el cambio de contraseña
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Ruta para cerrar sesión
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router;