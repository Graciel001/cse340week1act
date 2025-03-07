/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")


/* ***********************
 * View Engine and Templates
 *************************/
const path = require("path"); // Importar módulo para manejar rutas

// Configurar la carpeta de vistas correctamente
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/

// Index Route

app.use(static)

app.get("/", function(req, res){
  res.render("index", {title: "home"})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST
const DATABASE_URL = process.env.DATABASE_URL


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
