import {
    type,
    extend
} from "./utils";
import requireHandle from "./require";
import config from "./framwork.config";
import createModule from "./createModule";

//在这里初始化require
var require = requireHandle();



/**
 * 加载模块处理器
 * @param  {[type]}   moduleName loadModuleHandle  [所需加载的模块名称]
 * @param  {[type]}   accessModule [判断模块是否已经加载过]
 * @param  {Function} callback     [模块加载成功后的回调]
 * @return {[type]}                [description]
 */
function loadModuleHandle(moduleName, accessModule, callback) {

    var curModule;
    var originModulePath = config.basePath + (config.projectName ? "/" + config.projectName : "") + config.modulesPath + "/";

    curModule = accessModule(moduleName);

    if (!curModule) {

        originModulePath += moduleName + "/" + moduleName + ".js";
        require(originModulePath, function(_moduleName, _callback) {

            return function() {
                if (!accessModule(_moduleName)) {
                    throw new Error("请检查模块名称是否正确!");
                }

                loadModuleHandle(_moduleName, accessModule, _callback);
            };

        }(moduleName, callback));
        return;
    }

    if (curModule.extend) {

        loadModuleHandle(curModule.extend, accessModule, function(extendModuleContrustor) {
            callback(createModule(curModule.module, extendModuleContrustor));
        });

    } else {
        callback(curModule.module);
    }

}

/**
 * [loadModule]
 * @param  {[type]}   moduleName [模块名称]
 * @param  {[type]}   node       [挂载节点]
 * @param  {[type]}   setting    [设置]
 * @param  {Function} callback   [用户回调]
 * @param  {Function} accessModule   [读写模块]
 * @return {[type]}              [description]
 */
export default function() {
    //moduleName, node, setting, callback, accessModule
    var args = [].slice.call(arguments);
    var accessModule = args.pop();

    // if (type(args[1]) == "string") {
    //     args[1] = document.getElementById(args[1].substr(1));
    // }

    loadModuleHandle(args[0], accessModule, function(_args) {

        return function(ModuleConstructor) {
            new ModuleConstructor(_args[0], _args[1], _args[2], _args[3]);
            accessModule(ModuleConstructor);
        };

    }(args));

}
