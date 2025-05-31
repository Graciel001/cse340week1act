// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view by vehicle id
router.get("/detail/:inv_id", invController.buildByVehicleId);

// Inventory Management View
router.get("/", utilities.handleErrors(invController.buildManagement))

module.exports = router;
