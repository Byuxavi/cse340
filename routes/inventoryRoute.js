// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

/* ****************************************
 * RUTAS PÚBLICAS
 * Estas vistas son accesibles para cualquier visitante.
 * **************************************** */

// Route to build inventory by classification view
router.get(
  "/type/:classificationId", 
  utilities.handleErrors (invController.buildByClassificationId)
);

// Ruta para mostrar el detalle de un vehículo específico
router.get(
  "/detail/:invId", 
  utilities.handleErrors(invController.buildItemDetail)
);

// Ruta para provocar el error intencional 
router.get(
  "/trigger-error", 
  utilities.handleErrors(invController.triggerError)
);


/* ****************************************
 * RUTAS ADMINISTRATIVAS (PROTEGIDAS)
 * Requieren: Login + Tipo de cuenta (Admin/Employee)
 * **************************************** */

// Vista principal de gestión (Management)
router.get(
  "/", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildManagement)
);

// --- CLASIFICACIONES ---
router.get(
  "/add-classification", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  regValidate.newClassificationRules(), // Si tienes validaciones, van aquí
  regValidate.checkClassificationData,  // Si tienes validaciones, van aquí
  utilities.handleErrors(invController.addClassification)
);

// --- INVENTARIO (Añadir) ---
router.get(
  "/add-inventory", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  regValidate.newInventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventoryItem)
);

// --- JSON PARA AJAX (Usado en el Management View) ---
router.get(
  "/getInventory/:classification_id", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.getInventoryJSON)
);

// --- EDICIÓN (Update) ---
router.get(
  "/edit/:inv_id", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update/",
  utilities.checkLogin, 
  utilities.checkAccountType, 
  regValidate.newInventoryRules(), 
  regValidate.checkUpdateData,    
  utilities.handleErrors(invController.updateInventory)
);

// --- ELIMINACIÓN (Delete) ---
router.get(
  "/delete/:inv_id", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteView)
);

router.post(
  "/delete/", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteItem)
);

module.exports = router;