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

// Tarea 1: Mostrar Management
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", { title: "Vehicle Management", nav,classificationSelect, errors: null })
}

// Tarea 2: Mostrar Formulario Clasificación
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", { title: "Add New Classification", nav, errors: null })
}

// Tarea 2: Procesar Clasificación
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.insertClassification(classification_name)
  let nav = await utilities.getNav() 
  if (result) {
    req.flash("notice", `The classification ${classification_name} was successfully added.`)
    res.status(201).render("inventory/management", { title: "Vehicle Management", nav, errors: null })
  } else {
    req.flash("notice", "Sorry, the insertion failed.")
    res.status(501).render("inventory/add-classification", { title: "Add New Classification", nav, errors: null })
  }
}

// Tarea 3: Mostrar Formulario Inventario
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", { title: "Add New Vehicle", nav, classificationSelect, errors: null })
}

// Tarea 3: Procesar Inventario
invCont.addInventoryItem = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const result = await invModel.insertInventoryItem(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  if (result) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    res.status(201).render("inventory/management", { title: "Vehicle Management", nav, errors: null })
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Error: Could not add the vehicle.")
    res.status(501).render("inventory/add-inventory", { title: "Add New Vehicle", nav, classificationSelect, errors: null, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  
  // OJO: Asegúrate de que esta función exista en tu inventory-model.js
  const itemData = await invModel.getInventoryItemById(inv_id) 
  
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 * Build delete confirmation view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryItemById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 * Process the delete inventory request
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", "The vehicle was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}
module.exports = invCont
