const m = require("mithril")

const isEnter = v => v.keyCode === 13

/**
 * Enables one to define an anchor without having to think about having it look
 * or behave like one
 */
const anchor = (elem, args, text) => {
  if (args.onclick) {
    args.onkeyup = event => isEnter(event) && args.onclick(event)
  }

  return m(
    `${elem}.anchor`,
    {
      tabindex: 0,
      ...args
    },
    text
  )
}

module.exports = anchor
