import BaseModule from './BaseModule'
import Data from './Data'
import config from './framwork.config'
import loadModule from './loadModule'
import { type, extend, noop } from './utils'

const moduleCache = {}
const dataPriv = new Data()

/**
 * 创建一个缓存模块的对象
 */
dataPriv.access(moduleCache)

/**
 * 缓存 BaseModule
 */
dataPriv.access(moduleCache, 'BaseModule', {
    extend: null,
    module: BaseModule
})


export default (...args) => {

  var cacheModule
  var _initObj

  /**
   * initFramwork
   */
  if (args.length == 1 && type(args[0]) == 'object') {

    _initObj = args[0]

    extend(config, _initObj.config)

    document.addEventListener('DOMContentLoaded',()=>{
      R(
        _initObj.$module,
        _initObj.$mount,
        _initObj.setting || {},
        noop
      )
    })

  }

  /**
   * [定义模块，把模块保存起来]
   */
  if (args.length == 3 && type(args[2]) == 'function') {

    dataPriv.access(moduleCache, args[0],{
      extend : args[1],
      module : args[2]
    })

  }

  /**
   * if loadModule
   * moduleName   模块名称
   * mountNode  模块所挂载的节点，必须是id
   * setting  加载模块所注入的配置,区分不同场景
   * callback 加载模块之后的回调
   */
  if (args.length == 4 &&
      (/^#/.test(args[1]) || args[1].nodeType)) {

        if (/^#/.test(args[1])) {
          args[1] = document.getElementById(args[1].substr(1))
        }

      cacheModule = dataPriv.access(moduleCache, args[0])

      if (!cacheModule) {

          loadModule.apply(this, args.concat(function(moduleName) {

              /**
               * 通过这个函数访问模块
               * @param  {[type]} modeleContructor [模块构造器]
               * @return {[type]}                  [description]
               */
              return (moduleOpt, _moduleName) => {

                  if (type(moduleOpt) == 'string') {

                      return dataPriv.access(moduleCache, moduleOpt)

                  } else if (type(moduleOpt) == 'function') {

                      dataPriv.access(moduleCache, _moduleName || moduleName, {
                          module: moduleOpt
                      })

                  }

              }

          }(args[0])))

          return

      }

      new cacheModule(args[0], args[1], args[2], args[3])
  }

}
