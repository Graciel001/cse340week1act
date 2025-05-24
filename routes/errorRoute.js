const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")

// Route to trigger 505 error
router.get("/trigger-error", utilities.handleErrors((req, res) => {
  throw new Error("Intentional Server Crash")
}))

module.exports = router
