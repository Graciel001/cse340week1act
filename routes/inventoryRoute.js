// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view by vehicle id
router.get("/detail/:inv_id", invController.buildByVehicleId);

// Inventory Management View
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route classification_id
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

//inventory add classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

//inventory add inventory
router.get("/add-inventory", 
    utilities.handleErrors(invController.buildAddInventory)
  )

router.post("/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.addInventory)
)

// Route to build edit inventory view by inventory ID
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

// inventoryRoute.js
router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);



// Router to Delete
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteInventoryView)
)

// Router to Delete
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
)


module.exports = router;
