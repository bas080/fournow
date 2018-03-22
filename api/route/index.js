const registerFourSquareRoutes = require("./foursquare")

function registerRoutes(app) {
  registerFourSquareRoutes(app)
}

module.exports = registerRoutes
