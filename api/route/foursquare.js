const request = require("request-promise-native")
const config = require("../config")

function fourSquareHandler(fourSquareConfig) {
  return function fourSquareRequest(req, res) {
    const onResponse = response => {
      res
        .status(response.statusCode)
        .type("json")
        .send(response.body)

      return response
    }

    const fourSquareRequestConfig = {
      onResponse,
      ...fourSquareConfig
    }

    const qs = {
      ...config.foursquare.credentials,
      //todo:
      ...req.query,
      v: config.foursquare.version
    }

    return request({
      simple: false,
      resolveWithFullResponse: true,
      url: fourSquareRequestConfig.url,
      method: fourSquareRequestConfig.method,
      qs
    })
      .then(response =>
        fourSquareRequestConfig.onResponse(response, onResponse)
      )
      .catch(error => {
        // most likely and error that derives from the onResponse callback
        console.error(error)

        res.sendStatus(500)
      })
  }
}

module.exports = function registerFourSquareRoutes(app) {
  app.get(
    "/venues/categories",
    fourSquareHandler({
      method: "GET",
      url: "https://api.foursquare.com/v2/venues/categories"
    })
  )

  app.get(
    "/venues/search",
    fourSquareHandler({
      method: "GET",
      url: "https://api.foursquare.com/v2/venues/search"
    })
  )

  app.get(
    "/venues/explore",
    fourSquareHandler({
      method: "GET",
      url: "https://api.foursquare.com/v2/venues/explore",
      onResponse: (response, defaultResponse) => {
        console.log("logging example", "an venues/explore request")

        return defaultResponse(response)
      }
    })
  )
}
