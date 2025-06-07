const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view by inventory ID
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const data = await invModel.getVehicleById(inv_id)

    if (!data) {
      return next(new Error("Vehicle not found"))
    }

    const vehicleDetail = utilities.buildVehicleDetailHTML(data)
    const nav = await utilities.getNav()

    res.render("inventory/vehicle-detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      vehicleDetail,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Management
 * ************************** */

invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList,
    message: req.flash("notice")
  })
}

/* ***************************
 *  Build Addclassification
 * ************************** */

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    message: req.flash("notice"),
    errors: null
  })
}

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `${classification_name} successfully added.`)
    nav = await utilities.getNav(true)
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("notice")
    })
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
      errors: null
    })
  }
}


/* ***************************
 *  Build invController
 * ************************** */

invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    message: req.flash("notice"),
    errors: null,
    // Sticky values iniciales vacíos
    classification_id: "",
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: ""
  })
}


invCont.addInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)

  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

  const result = await invModel.addInventory(
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles, inv_color
  )

  if (result) {
    req.flash("notice", "Inventory item added successfully.")
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("notice")
    })
  } else {
    req.flash("notice", "Failed to add inventory item.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: null,
      ...req.body // Sticky values
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    if (!itemData) {
      return next(new Error("Inventory item not found"))
    }
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  try {
    let {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    // Manejar si classification_id viene como array (por ejemplo: ["3", "3"])
    if (Array.isArray(classification_id)) {
      classification_id = classification_id[0]
    }

    // Convertir a tipo adecuado
    inv_id = parseInt(inv_id)
    inv_price = parseFloat(inv_price)
    inv_year = parseInt(inv_year)
    inv_miles = parseInt(inv_miles)
    classification_id = parseInt(classification_id)

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
    }
  } catch (error) {
    console.error("Update Inventory Error:", error)
    next(error)
  }
}

/* ***************************
 * Build delete confirmation view
 * ************************** */
invCont.buildDeleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const name = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + name,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}


/* ***************************
 * Process the delete request
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    console.log("🔎 inv_id recibido:", inv_id)

    const deleteResult = await invModel.deleteInventoryItem(inv_id)
    console.log("📦 Resultado de delete:", deleteResult)

    if (deleteResult.rowCount > 0) {
      req.flash("notice", "The inventory item was successfully deleted.")
      res.redirect("/inv")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      res.redirect("/inv/delete/" + inv_id)
    }
  } catch (error) {
    console.error("❌ Error en deleteInventory controller:", error.message)
    next(error)
  }
}

invCont.buildDeleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  try {
    const itemData = await invModel.getVehicleById(inv_id);
    if (!itemData) {
      req.flash("notice", "Sorry, no matching inventory item found.");
      return res.redirect("/inv");
    }
    const nav = await utilities.getNav(req, res, next);
    res.render("inventory/delete-confirm", {
      title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      inv_id: itemData.inv_id,
      nav,  // enviar nav a la vista
    });
  } catch (error) {
    console.error("Error in buildDeleteInventoryView: " + error);
    next(error);
  }
}



module.exports = invCont
