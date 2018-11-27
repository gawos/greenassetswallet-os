const rewireMobX = require('react-app-rewire-mobx')
const { injectBabelPlugin } = require('react-app-rewired')
const rewireAntd = require('react-app-rewire-antd')
const rewireCssModules = require('react-app-rewire-css-modules')
const rewireGqlTag = require('react-app-rewire-graphql-tag')
const rewireLess = require('react-app-rewire-less')

/* config-overrides.js */
module.exports = function override(config, env) {
  // add a plugin
  // use the MobX rewire
  let conf = rewireGqlTag(config, env)
  const configCssModules = rewireCssModules(Object.assign({}, conf), ...env)
  const configAnt = rewireAntd()(configCssModules, env)
  const configMobX = rewireMobX(configAnt, env)
  conf = rewireLess.withLoaderOptions({
    javascriptEnabled: true
    // modifyVars: { "@primary-color": "#1DA57A" },
  })(conf, env)

  return configMobX
}
