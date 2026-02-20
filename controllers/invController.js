const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Construir vista de inventario por clasificación (Muchos autos)
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId  // Este nombre no es al azar. Es exactamente el mismo nombre que pusiste en tu archivo de rutas después de los dos puntos (:classificationId).
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Construir vista de detalle de un vehículo (Un solo auto)
 * ************************** */
invCont.buildItemDetail = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryItemById(inv_id)
  
  // Verificamos si el vehículo existe
  if (!data) {
    const err = new Error("Vehicle not found")
    err.status = 404
    return next(err)
  }

  // Generamos el HTML usando la función de utilidad (Task One)
  const detailHtml = await utilities.buildItemDetail(data)
  
  let nav = await utilities.getNav()
  const itemName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  
  res.render("./inventory/detail", {
    title: itemName,
    nav,
    grid: detailHtml, // Enviamos el HTML formateado
  })
}

/* ***************************
 * Trigger Intentional Error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  // Lanzamos un error a propósito
  throw new Error("Oh no! Se ha producido un error crítico de prueba (Task 3).")
}

module.exports = invCont