const registerFourSquareRoutes = require("./foursquare")

function registerRoutes(app, config) {
  registerFourSquareRoutes(app, config.foursquare)
}

module.exports = registerRoutes
