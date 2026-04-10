const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const accountModel = require("../models/account-model")
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  }),
  
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req) // La función validationResult no es de un archivo que tú hayas escrito; pertenece al paquete express-validator que instalaste mediante la terminal.
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // el correo es obligatorio y debe ser válido
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address."),

    // la contraseña debe seguir las mismas reglas que el registro
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email, // Mandamos el correo de vuelta para que no se borre si hay error
    })
    return
  }
  next()
}
/* ******************************
 * Reglas de actualización de cuenta
 * ***************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().isLength({ min: 1 }).withMessage("Please provide a first name."),
    body("account_lastname").trim().isLength({ min: 1 }).withMessage("Please provide a last name."),
    body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required.")
    // Nota: Aquí no validamos si el email existe todavía, lo haremos en el checkUpdateData si cambia
  ]
}

/* ******************************
 * Reglas de actualización de contraseña
 * ***************************** */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check Update Data
 * ***************************** */
/* ******************************
 * Check Update Data (Task 5 Especial)
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  
  // 1. Obtenemos los datos actuales de la DB para comparar
  const currentAccountData = await accountModel.getAccountById(account_id)
  
  let errors = validationResult(req)
  let errorList = errors.array()

  // 2. Si el email cambió, verificamos si el nuevo ya existe en otro usuario
  if (account_email !== currentAccountData.account_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists) {
      errorList.push({ msg: "Email already exists. Please use a different one." })
    }
  }

  if (errorList.length > 0) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      errors: { array: () => errorList }, // Formateamos para que el EJS lo entienda
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
    return
  }
  next()
}

/* ******************************
 * Check Password Update Data
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // Como es password, no mandamos el password de vuelta (seguridad)
    res.render("account/update-account", {
      errors,
      title: "Edit Account",
      nav,
      account_id,
    })
    return
  }
  next()
}

module.exports = validate