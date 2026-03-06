const utilities = require("../utilities/")
const accountModel = require("../models/account-model") 
/* ****************************************
* Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
* Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  
  // 2. Desestructuración: Extraer los datos que vienen del formulario (req.body)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // 3. Llamar al modelo para intentar guardar al usuario
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    // 4. Si tuvo éxito (regResult es verdadero)
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    // 5. Si falló (regResult es nulo o falso)
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


module.exports = { buildLogin, buildRegister, registerAccount }