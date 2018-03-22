const m = require("mithril")
const geo = require("./client/geo")
const anchor = require("./client/anchor")

const everythingCategory = {
  name: "Everything",
  id: null
}

const state = {
  title: everythingCategory.name,
  venues: [],
  failed: false,
  searching: false
}

const amsterdam = {
  latitude: 52.370216,
  longitude: 4.895168
}

function coordsToString({ latitude, longitude }) {
  return `${latitude},${longitude}`
}

m.route(document.body, "/start", {
  "/start": {
    onmatch: params => {
      return geo()
        .then(({ coords }) => {
          m.route.set("/venues", {
            ...params,
            longitude: coords.longitude,
            latitude: coords.latitude
          })
        })
        .catch(error => {
          console.error(error)

          m.route.set("/venues", { ...params, ...amsterdam })
        })
    }
  },
  "/venues": {
    onmatch: params => {
      console.log("onmatch", params)

      const query = {
        ll: coordsToString(params),
        limit: 40
      }

      if (params.category) {
        query.categoryId = params.category
      }

      return m
        .request({
          method: "GET",
          url: "/venues/search",
          data: query
        })
        .then(data => {
          state.venues = data.response.venues

          state.searching = false
        })
        .catch(error => {
          state.failed = true
          console.error(error)

          state.searching = false
        })
    },
    render: ({ attrs }) => {
      return [
        ...categorySelect(state.categories, attrs),
        m("h2", (state.searching ? "Searching for " : "") + state.title),
        state.venues.map(venueCard)
      ]
    }
  }
})

m
  .request({
    method: "GET",
    url: "/venues/categories"
  })
  .then(data => (state.categories = data.response.categories))
  .catch(error => console.error(error))

function categorySelect(categories = [], params) {
  const onClick = category => {
    const { id, name } = category

    state.searching = true
    state.title = name

    const query = {
      latitude: params.latitude,
      longitude: params.longitude
    }

    if (everythingCategory !== category) {
      query.category = id
    }

    m.route.set("/venues", query)
  }

  const isSelected = category => category.id === params.category

  return [
    anchor(
      `a${isSelected(everythingCategory) && ".selected"}`,
      { onclick: onClick.bind(null, everythingCategory) },
      everythingCategory.name
    ),
    ...categories.map(category =>
      anchor(
        `a${isSelected(category) && ".selected"}`,
        { onclick: onClick.bind(null, category) },
        category.name
      )
    )
  ]
}

function isNil(v) {
  return v === null || v === undefined
}

function venueCard(venue) {
  return m(".card", [
    m("h2", m(venue.url ? "a" : "span", { href: venue.url }, venue.name)),
    m("p", venueAdress(venue))
  ])
}

function venueAdress(venue) {
  return venue.location.formattedAddress
    ? m("span", venue.location.formattedAddress.join(", "))
    : m("span", "no address")
}
