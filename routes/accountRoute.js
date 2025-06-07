// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountsController = require("../controllers/accountsController")
const regValidate = require('../utilities/account-validation')
const checkLogin = require('../middleware/checkLogin');


// Route to build login view
router.get("/login", utilities.handleErrors(accountsController.buildLogin))

// Route to build register view 
router.get("/register", utilities.handleErrors(accountsController.buildRegister))

// Account management view
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin, utilities.handleErrors(accountsController.buildAccountManagement)
)

/* Logout route */
router.get("/logout", accountsController.accountLogout)


router.get(
  "/update/:account_id",
  checkLogin,
  utilities.handleErrors(accountsController.editAccountView)
);

router.post(
  "/update/:account_id",
  checkLogin,
  regValidate.accountUpdateRules(),
  regValidate.checkUpdateData,       
  utilities.handleErrors(accountsController.processAccountUpdate)
);
//  Route to process the registration (POST)
//router.post("/register", utilities.handleErrors(accountsController.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountsController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData, 
  utilities.handleErrors(accountsController.accountLogin)
)

// Export the router
module.exports = router
