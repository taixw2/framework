import Data from "./Data";
import BaseModule from "./BaseModule";
import config from "./framwork.config";
import {
    type,
    extend,
    noop
} from "./utils";
import loadModule from "./loadModule";

import use from "./install-plugins";

const moduleCache = {};

const dataPriv = new Data();

dataPriv.access(moduleCache);

dataPriv.access(moduleCache, "BaseModule", {
    extend: null,
    module: BaseModule
});

// moduleName, extend, ModuleCallback
/**
 * [Ready]
 * loadModule
 * initFramwork
 */
const R = function() {

    var args = [].slice.call(arguments);
    var cacheModule;
    var _initObj;

    /**
     * initFramwork
     */
    if (args.length == 1 && type(args[0]) == "object") {

      _initObj = args[0];

      extend(config,_initObj.config);

      document.addEventListener("DOMContentLoaded",()=>{
        R(
          _initObj.$module,
          _initObj.$mount,
          _initObj.setting || {},
          noop
        );
      });

    }

    /**
     * [length 我晕，，，忘了定于模块，导致加载不到模块]
     * @type {[type]}
     */
    if (args.length == 3 && type(args[2]) == "function") {

      dataPriv.access(moduleCache, args[0],{
        extend : args[1],
        module : args[2]
      });

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
            args[1] = document.getElementById(args[1].substr(1));
          }

        cacheModule = dataPriv.access(moduleCache, args[0]);

        if (!cacheModule) {

            loadModule.apply(this, args.concat(function(moduleName) {

                /**
                 * 通过这个函数访问模块
                 * @param  {[type]} modeleContructor [模块构造器]
                 * @return {[type]}                  [description]
                 */
                return function accessModule(moduleOpt,_moduleName) {

                    if (type(moduleOpt) == "string") {

                        return dataPriv.access(moduleCache, moduleOpt);

                    } else if (type(moduleOpt) == "function") {

                        dataPriv.access(moduleCache, _moduleName || moduleName, {
                            module: moduleOpt
                        });

                    }

                };

            }(args[0])));

            return;

        }

        new cacheModule(args[0], args[1], args[2], args[3]);
    }
};


R.use = use(BaseModule);
/*jshint ignore:start*/
window.R = R;
/*jshint ignore:end*/
