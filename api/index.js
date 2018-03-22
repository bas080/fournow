const routes = require("./route")
const express = require("express")
const app = express()
const registerRoutes = require("./route")
const config = require("./config")
const path = require("path")

app.set("port", config.api.port || 3000)
//app.use(express.static(__dirname)); // Current directory is root
registerRoutes(app)

app.use(express.static(path.join(__dirname, "../dist/")))

const server = app.listen(app.get("port"), () => {
  console.log(`Express server listening on port ${server.address().port}`)
})

module.exports = server
