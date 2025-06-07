// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")
const checkAdminEmployee = require('../middleware/checkAdminEmployee')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view by vehicle id
router.get("/detail/:inv_id", invController.buildByVehicleId);

// Inventory Management View (requires admin route)
router.get("/", checkAdminEmployee, utilities.handleErrors(invController.buildManagement))

// Route classification_id (solo lectura, no necesita middleware)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Inventory add classification (Protected)
router.get("/add-classification", checkAdminEmployee, utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification",
  checkAdminEmployee,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Inventory add inventory (protected)
router.get("/add-inventory", 
  checkAdminEmployee,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post("/add-inventory",
  checkAdminEmployee,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.addInventory)
)

// Route to build edit inventory view by inventory ID (protected)
router.get(
  "/edit/:inv_id",
  checkAdminEmployee,
  utilities.handleErrors(invController.editInventoryView)
)

// Update inventory (protected)
router.post(
  "/update",
  checkAdminEmployee,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete inventory view (protected)
router.get(
  "/delete/:inv_id",
  checkAdminEmployee,
  utilities.handleErrors(invController.buildDeleteInventoryView)
)

// Delete inventory action (protected)
router.post(
  "/delete",
  checkAdminEmployee,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;
