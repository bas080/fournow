const defaultOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
}

/**
 * @param {Object} options
 *
 * @returns {Promise}
 */
function geo(options) {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      ...defaultOptions,
      ...options
    })
  )
}

module.exports = geo
