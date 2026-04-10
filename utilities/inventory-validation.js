const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Reglas de validación para Inventario
 * ********************************* */
validate.newInventoryRules = () => {
  return [
    body("inv_make").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Please provide a make."),
    body("inv_model").trim().escape().notEmpty().isLength({ min: 3 }).withMessage("Please provide a model."),
    body("inv_year").trim().isInt({ min: 1900, max: 2099 }).withMessage("Please provide a valid year."),
    body("inv_description").trim().notEmpty().withMessage("Please provide a description."),
    body("inv_image").trim().notEmpty().withMessage("Please provide an image path."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Please provide a thumbnail path."),
    body("inv_price").trim().isDecimal().withMessage("Please provide a valid price."),
    body("inv_miles").trim().isInt().withMessage("Please provide valid mileage."),
    body("inv_color").trim().escape().notEmpty().withMessage("Please provide a color."),
    body("classification_id").trim().isInt().withMessage("Please select a classification."),
  ]
}

/* ******************************
 * Check data and return errors to EDIT view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
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
    classification_id,
  } = req.body
  
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors,
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
      classification_id,
    })
    return
  }
  next()
}

/* **********************************
 * Reglas para Nueva Clasificación
 * ********************************* */
validate.newClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Please provide a valid classification name (no spaces or special characters)."),
  ]
}

/* ******************************
 * Check Classification Data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name,
    })
    return
  }
  next()
}

/* ******************************
 * Check Inventory Data (Para añadir nuevo)
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    })
    return
  }
  next()
}

module.exports = validate