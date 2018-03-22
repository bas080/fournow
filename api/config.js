const assert = require("assert")

module.exports = {
  api: {
    port: process.env.API_PORT || 3000
  },
  foursquare: {
    version: toDefault("FOURSQUARE_VERSION", "20170801"),
    credentials: {
      client_id: required("FOURSQUARE_CLIENT_ID"),
      client_secret: required("FOURSQUARE_CLIENT_SECRET")
    }
  }
}

function toDefault(name, value) {
  const v = process.env[name] || value

  assert.ok(v, `${name} is a required environment variable`)

  return v
}

function required(name) {
  const value = process.env[name]

  assert.ok(value, `${name} is a required environment variable`)

  return value
}
