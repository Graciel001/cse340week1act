const jwt = require('jsonwebtoken');
require('dotenv').config();

function checkLogin(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      req.flash("notice", "You must be logged in to view that page.");
      return res.status(401).redirect("/account/login");
    }

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload; // Guarda la info del usuario en req.user para usar después si quieres
    return next();
  } catch (error) {
    console.error("Error in checkLogin:", error);
    req.flash("notice", "Authentication error. Please log in again.");
    return res.status(401).redirect("/account/login");
  }
}

module.exports = checkLogin;