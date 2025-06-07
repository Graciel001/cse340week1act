// Needed Resources
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    message: req.flash("notice")
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
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // Regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )  

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      req.session.loggedin = true
      req.session.account_id = accountData.account_id
      req.session.account_firstname = accountData.account_firstname
      req.session.account_lastname = accountData.account_lastname
      req.session.account_type = accountData.account_type

      const accessToken = jwt.sign(
        {
          account_id: accountData.account_id,
          account_firstname: accountData.account_firstname,
          account_lastname: accountData.account_lastname,
          account_type: accountData.account_type // 👈 ¡ESTE ES CLAVE!
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      )

      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }

      req.session.save(() => {
        return res.redirect("/account/")
      })
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/* ****************************************
 *  Build Account Management
 * ************************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();

  const user = {
    account_id: req.session.account_id,
    account_firstname: req.session.account_firstname,
    account_type: req.session.account_type
  };
  console.log("↪︎ buildAccountManagement user:", user);
  res.render("account/management", {
    title: "Account Management",
    nav,
    user,
    message: req.flash("message")
  });
}


/* ****************************************
 * Process Logout
 * ************************************ */
async function accountLogout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err)
    }
    res.clearCookie("jwt")
    res.redirect("/")
  })
}

/* ****************************************
 * Show Edit Account Form
 * ************************************ */
async function editAccountView(req, res) {
  const nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/edit-account", {
    title: "Update Account",
    nav,
    account: accountData
  });
}


/* ****************************************
 * Process Account Update (POST)
 * ************************************ */
async function processAccountUpdate(req, res) {
  const nav = await utilities.getNav();
  const account_id = req.params.account_id;

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const updatedAccountData = {
    account_firstname,
    account_lastname,
    account_email,
  };

  if (account_password && account_password.length > 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(account_password, 10);
    updatedAccountData.account_password = hashedPassword;
  }

  try {
    const updateResult = await accountModel.updateAccount(account_id, updatedAccountData);

    if (updateResult) {
      req.flash("success", "Account information updated successfully.");
      return res.redirect("/account");
    } else {
      req.flash("error", "Failed to update account information.");
      return res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "An unexpected error occurred.");
    return res.redirect(`/account/update/${account_id}`);
  }
}
module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount,
  accountLogin,
  buildAccountManagement,
  accountLogout,
  editAccountView,
  processAccountUpdate
}

