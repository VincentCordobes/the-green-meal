const {env} = require("./next.config")

module.exports = () => {
  Object.assign(process.env, env)
}
