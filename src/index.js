import Data from './Data'
import BaseModule from './BaseModule'
import config from './framwork.config'
import loadModule from './loadModule'
import pluginsConfig from './plugins/pluginsConfig'
import use from './install-plugins'
import enter from './enter'
import { type, extend, noop } from './utils'

/**
 * [Ready]
 * loadModule
 * initFramwork
 */
const R = enter

R.use = use(BaseModule)

pluginsConfig.forEach(v => R.use({
  install: {
    [v.alias]: v.value,
  }
}))

/*jshint ignore:start*/
window.R = R
/*jshint ignore:end*/
