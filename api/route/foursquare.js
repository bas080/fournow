const request = require("request-promise-native")

function fourSquareHandler(config) {
  return function fourSquareRequest(req, res) {
    const onResponse = response => {
      res
        .status(response.statusCode)
        .type("json")
        .send(response.body)

      return response
    }

    const requestConfig = {
      onResponse,
      ...config
    }

    const qs = {
      ...config.credentials,
      ...req.query,
      v: config.version
    }

    return request({
      simple: false,
      resolveWithFullResponse: true,
      url: requestConfig.url,
      method: requestConfig.method,
      qs
    })
      .then(response => requestConfig.onResponse(response, onResponse))
      .catch(error => {
        // Could be an error thrown in the onResponse or a request that failed
        // to complete successfully
        console.error(error)

        res.sendStatus(500)
      })
  }
}

module.exports = function registerFourSquareRoutes(app, config) {
  const configuredHandler = urlConfig =>
    fourSquareHandler({
      ...urlConfig,
      ...config
    })

  app.get(
    "/venues/categories",
    configuredHandler({
      method: "GET",
      url: "https://api.foursquare.com/v2/venues/categories"
    })
  )

  app.get(
    "/venues/search",
    configuredHandler({
      method: "GET",
      url: "https://api.foursquare.com/v2/venues/search"
    })
  )

  app.get(
    "/venues/explore",
    configuredHandler({
      method: "GET",
      url: "https://api.foursquare.com/v2/venues/explore",
      onResponse: (response, defaultResponse) => {
        console.log("logging example", "an venues/explore request")

        return defaultResponse(response)
      }
    })
  )
}
