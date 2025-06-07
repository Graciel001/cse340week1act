const jwt = require('jsonwebtoken')
require('dotenv').config()

function checkAdminEmployee(req, res, next) {
  try {
    const token = req.cookies.jwt
    if (!token) {
      req.flash("notice", "You must be logged in as Employee or Admin to view that page.")
      return res.status(401).redirect("/account/login")
    }

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("Payload account_type:", payload.account_type)

    if (payload.account_type === "Employee" || payload.account_type === "Admin") {
      req.user = payload
      return next()
    } else {
      req.flash("notice", "You do not have permission to view that page.")
      return res.status(403).redirect("/account/login")
    }
  } catch (error) {
    console.error("Error in checkAdminEmployee:", error)
    req.flash("notice", "Authentication error. Please log in again.")
    return res.status(401).redirect("/account/login")
  }
}

module.exports = checkAdminEmployee
