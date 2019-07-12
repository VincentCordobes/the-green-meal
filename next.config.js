const withCSS = require("@zeit/next-css")

module.exports = withCSS({
  env: {
    API_URL: process.env.API_URL || "http://localhost:3000",
  },
})
