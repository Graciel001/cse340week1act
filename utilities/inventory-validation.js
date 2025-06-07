const { body, validationResult } = require("express-validator")

const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters allowed.")
  ]
}

const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await require("./").getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      message: req.flash("notice"),
      errors: errors.array()
    })
    return
  }
  next()
}

const inventoryRules = () => {
    return [
      body("classification_id").notEmpty().withMessage("Classification is required."),
      body("inv_make").trim().notEmpty().withMessage("Make is required."),
      body("inv_model").trim().notEmpty().withMessage("Model is required."),
      body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year."),
      body("inv_description").trim().notEmpty().withMessage("Description is required."),
      body("inv_image").trim().notEmpty().withMessage("Image path is required."),
      body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
      body("inv_price").isFloat({ gt: 0 }).withMessage("Price must be greater than zero."),
      body("inv_miles").isInt({ gt: 0 }).withMessage("Miles must be greater than zero."),
      body("inv_color").trim().notEmpty().withMessage("Color is required.")
    ]
  }
  
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const classificationList = await require("./").buildClassificationList(req.body.classification_id)
  if (!errors.isEmpty()) {
    const nav = await require("./").getNav()
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      message: req.flash("notice"),
      errors: errors.array(),
      ...req.body  // Aquí metemos todo el body, incluyendo inv_id, inv_make, etc
    })
    return
  }
  next()
}


module.exports = {
  classificationRules,
  checkClassificationData,
  checkUpdateData,
  inventoryRules
}
