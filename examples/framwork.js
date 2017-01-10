/*!
 * v1.0.0
 * (c) 2016-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var objToStr = {}.toString;
var class2type = {};
var typeList = "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ");
for (var i = 0; i < typeList.length; i++) {
    class2type["[object " + typeList[i] + "]"] = typeList[i].toLowerCase();
}

var uuid = function uuid() {
    var fix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "iqqq";

    return fix + "_" + Math.random().toString(16).substr(2);
};

/**
 * 判断参数类型
 */
var type = function type(arg) {

    var _type = typeof arg === "undefined" ? "undefined" : _typeof(arg);

    if (_type !== "object") {
        return _type;
    }
    return class2type[objToStr.call(arg)];
};

/**
 * 判断是否数组
 */
var isArray = function isArray(obj) {
    return type(Array.isArray) != "undefined" ? Array.isArray(obj) : objToStr.call(obj) === "[object Array]";
};
/**
 * 判断是否函数
 */


/**
 * 遍历
 * 支持对象/数组
 */
var each = function each(arg, callback, context) {

    var k;
    var l;

    if (type(arg) === "object") {
        for (k in arg) {
            callback.call(context || this, arg[k], k);
        }
    } else if (type(arg) === "array") {

        if (type(arg.forEach) !== "undefined") {
            arg.forEach(callback, context);
        } else {
            l = arg.length;
            for (; k < l; k++) {
                callback.call(context || this, arg[k], k);
            }
        }
    } else {
        return arg;
    }
};



var noop = function noop() {};
//

var extend = function extend() {

    var args = [].slice.call(arguments);
    var target = args.shift();
    var l = args.length;
    var deep = false;
    var copy;
    var clone;
    var i = 0;
    var option;
    var k;

    if (type(target) == "boolean") {
        deep = target;
        target = args.shift();
        l--;
    }

    for (; i < l; i++) {

        option = args[i];

        if (type(option) !== "null" && type(option) === "object") {

            for (k in option) {

                copy = option[k];

                if (deep && type(copy) == "object") {

                    target[k] = extend(deep, type(target[k]) == "object" ? target[k] : {}, copy);
                } else {

                    target[k] = copy;
                }
            }
        }
    }
    return target;
};

//参考jquery.data
var Data = function () {
    function Data() {
        classCallCheck(this, Data);

        this.expando = uuid();
    }

    createClass(Data, [{
        key: "cache",
        value: function cache(owner) {
            var value = owner[this.expando];
            if (!value) {

                value = {};

                Object.defineProperty(owner, this.expando, {
                    value: value,
                    configurable: true //允许使用delete 删除
                });
            }
            return value;
        }
    }, {
        key: "set",
        value: function set$$1(owner, data, value) {
            var prop,
                cache = this.cache(owner);

            if (type(data) == "string") {
                cache[data] = value;
            } else {
                each(data, function (val, key) {
                    cache[key] = val;
                });
            }
        }
    }, {
        key: "get",
        value: function get$$1(owner, key) {

            return type(key) == "undefined" ? this.cache(owner) : owner[this.expando] && owner[this.expando][key];
        }
    }, {
        key: "access",
        value: function access(owner, key, value) {

            if (type(key) == "undefined" || type(key) == "string" && type(value) == "undefined") {

                return this.get(owner, key);
            }

            this.set(owner, key, value);
        }
    }, {
        key: "remove",
        value: function remove(owner, key) {

            var cache = owner[this.expando];

            if (type(cache) == "undefined") {
                return;
            }

            if (type(key) != "undefined") {

                if (!isArray(key)) {
                    key = key in cache ? [key] : [];
                }

                while (key) {
                    delete cache[key.shift()];
                }
            }
        }
    }]);
    return Data;
}();

var createModule = function (subModule, supModule) {

    var Constructor = function Constructor() {

        if (this.init) this.init.apply(this, arguments);
    };

    if (type(supModule) == "function") {

        var F = function F() {};

        F.prototype = supModule.prototype;

        Constructor.prototype = new F();

        F = null;
    }

    Constructor.prototype.main = function () {

        throw new Error("main方法未实现");
    };

    extend(Constructor.prototype, new subModule());

    Constructor.prototype.constructor = subModule;

    return Constructor;
};

/**
 * BaseClass
 */

var Base = function () {
  function Base() {
    classCallCheck(this, Base);


    this.version = "1.0.0";
  }

  createClass(Base, [{
    key: "init",
    value: function init(mod, ele, opt, callback) {

      /*jshint ignore:start*/
      console.log(arguments);
      /*jshint ignore:end*/

      //终于执行到这里
      //在脑中运行真的是....
    }
  }]);
  return Base;
}();

var BaseModule = createModule(Base);

//用户通过R传入对象的config方法修改一下配置自
//配置被用在loadModule.js中
var config = {

  basePath: location.origin,
  projectName: "",
  modulesPath: "/modules"

};

var PubSub = function () {
    function PubSub() {
        classCallCheck(this, PubSub);

        this.handles = {};
    }

    createClass(PubSub, [{
        key: "$on",
        value: function $on(eventType, handle) {
            var handles = this.handles[eventType];
            if (!(eventType in this.handles)) {
                this.handles[eventType] = {
                    memory: null,
                    callbacks: []
                };
                handles = this.handles[eventType];
            }

            if (handles.memory) {
                handle.apply(this, this.handles[eventType]);
                return;
            }

            handles.callbacks.push(handle);
        }
    }, {
        key: "$emit",
        value: function $emit(eventType) {
            var args = [].slice.call(arguments, 1);
            var handles = this.handles[eventType];
            var handle;

            if (!eventType || !handles) {
                throw new Error(eventType + "对象不存在");
            }

            handles.memory = args;

            handle = handles.callbacks;
            while (handle.length) {
                handle.shift().apply(this, args);
            }
        }
    }]);
    return PubSub;
}();

/**
 * 整体雏形
 */
var requireHandle = function () {

    if (typeof require !== "undefined" && typeof define != "undefined") {
        return;
    }

    var pubSub = new PubSub();

    var modulesCache = {};
    var doc = document;
    var body = doc.body;
    var superScript = document.currentScript ? true : false;

    var defaultConfig = {
        baseUrl: "/",
        paths: {},
        // waitSeconds: 0,
        exports: {}
    };

    /**
     * require处理
     * @param  {[type]}   path     [路径，可能是远程路径，也可能是config中定义的]
     * @param  {[type]}   _private     [是否用于内部使用]
     * @param  {[type]}   noDefine [一些没有使用define导出并且无法在config配置的项]
     * @param  {Function} callback [加载完成后的回调]
     */
    function requireHandle(path, _private, callback) {
        //精准路径
        var exactPath;
        var requireExport;
        var config = _require.config;
        var id;

        // 判断路径是否远程路径
        // (*):// || //
        if (matchUrl(path) === false) {

            if (!config.paths[path]) {
                exactPath = path;
                // throw new Error("加载模块路径错误:" + path);
            } else {
                exactPath = config.baseUrl + config.paths[path];
            }
            id = path;
        } else {
            id = exactPath = path;
        }

        requireExport = _private ? path : config.exports[path];

        if (type(modulesCache[id]) !== "undefined") {
            return modulesCache[id];
        }

        loadScript(exactPath, id, requireExport, callback);
    }

    /**
     * 加载脚本
     */
    function loadScript(path, id, exp, callback) {

        var script = document.createElement("script");
        script.src = path;
        script.id = id;

        // 添加回调
        // 如果
        pubSub.$on(id, callback);

        script.onload = function (_script, _id, _exp) {
            return function () {
                _script.onload = null;
                // callback();
                removeScript(_script);

                //目前仅支持
                // 要么使用define导出js
                // 要么在config中配置 exports
                if (_exp) {
                    pubSub.$emit(_id, window[_exp]);
                }
            };
        }(script, id, exp);

        body.appendChild(script);
    }

    /**
     * 删除脚本
     */
    function removeScript(script) {

        if (type(script.remove) === "undefined") {
            script.parentNode.removeChild(script);
        } else {
            script.remove();
        }
    }

    //require 只发布一个对象，而对象的回调在define中执行
    function _require(modules, callback) {

        var modulesLength;
        var modulesStart = 0;
        var i = 0;
        //简单把回调存在这里
        var modulesCallbackArr = [];
        modulesCallbackArr.length = modulesLength;

        if (type(modules) === "function" || !modules && type(callback) === "function") {
            return modules();
        } else if (type(modules) === "string") {

            modules = [modules];
        }

        depHandler(modules, function () {
            //依赖加载完的回调
            callback.apply(this, arguments);
        });
    }

    //仅用于内部
    function _coreRequire(modules, callback) {

        depHandler([modules], function () {
            //依赖加载完的回调
            callback.apply(this, arguments);
        }, true);
    }

    //对依赖的处理
    function depHandler(modules) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

        var _private = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var params = [];
        var start = 0;
        var l = modules.length;

        if (!l) {
            callback();
            return;
        }

        each(modules, function (v, i) {
            requireHandle(v, _private, function (_i) {
                return function (param) {
                    //执行define的时候会执行这个回调
                    //表示loaded
                    start++;
                    params[_i] = param;
                    if (start === l) {
                        callback.apply(null, params);
                    }
                };
            }(i));
        });
    }

    //执行define,
    // 判断当前所执行的脚本的id找出require中注册的moduleCache
    // 执行对应的callback
    function _define(namespace, deps, callback) {

        var dependents = [];

        var args = [].slice.call(arguments, 0);

        namespace = args[0];

        var DOC = document;
        var currentScript = DOC.currentScript;

        var stack;
        var i, l;

        // 第一个参数校验
        var arg1IsNamespace = namespace && type(namespace) === "string";
        if (!currentScript && !arg1IsNamespace) {
            //兼容不支持document.currentScript < IE 9
            // 详见 ： http://www.cnblogs.com/rubylouvre/archive/2013/01/23/2872618.html
            try {
                a.b.c.d.e();
            } catch (e) {
                stack = e.stack;
                if (!stack && window.opera) {
                    //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                    stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
                }
            }
            if (stack) {
                stack = stack.split(/[@ ]/g).pop();
                stack = stack[0] == "(" ? stack.slice(1, -1) : stack;
                stackUrl = stack.replace(/(:\d+)?:\d+$/i, "");
                scripts = DOC.scripts;
                i = 0;
                l = scripts.length;
                for (; i < l; i++) {
                    if (scripts[i] === stackUrl) {
                        currentScript = {
                            id: scripts[i].id
                        };
                        break;
                    }
                }
            } else {
                throw "超过所支持浏览器范畴，浏览器信息:" + navigator.userAgent;
            }
        }

        if (currentScript && arg1IsNamespace) {
            if (currentScript.id !== namespace) {
                throw "定义模块命名空间与引入模块别名不一致";
            }
        }

        var _namespace, _deps, _callback;

        var _defineModule = {
            namespace: namespace && type(namespace) === "string" ? namespace : currentScript.id,
            callback: function callback() {}
        };

        /** 返回一个对象
         * namespace
         * deps
         * callback
         */
        var normParam = paramsAdaptive.bind(this, currentScript.id).apply(this, args);

        // 判断是否需要加载依赖
        // 没有则立即执行
        if (!normParam.deps.length) {
            pubSub.$emit(normParam.namespace, normParam.callback());
        } else {

            depHandler(normParam.deps, function () {
                pubSub.$emit(normParam.namespace, normParam.callback.bind(null, arguments)());
            });
        }
    }

    /**
     * 参数适配
     */
    function paramsAdaptive() {

        /**
         * 例举参数形式
         * string,array,function
         * Boolean(false),function
         * array,function
         * string,function
         * function
         */
        var id = arguments[0];
        var args = [].slice.call(arguments, 1);
        var namespace;
        var deps;
        var callback = args.pop(); //回调永远在最后一位的原则
        var tmp;
        tmp = args.shift();
        // string 有时为 ""
        if (type(tmp) === "string") {
            namespace = tmp || id;
        }
        if (args.length === 1) {
            deps = args[0];
        } else {
            deps = [];
        }
        if (type(tmp) === "array") {
            namespace = id;
            deps = tmp;
        }
        if (type(tmp) === "undefined") {
            namespace = id;
            deps = [];
        }
        return {
            namespace: namespace,
            deps: deps,
            callback: callback
        };
    }

    function matchUrl(url) {
        return url.match(/.*:\/\/|^\/\//) ? true : false;
    }

    _require.config = defaultConfig;

    window.require = _require;
    window.define = _define;

    return _coreRequire;
};

var require$1 = requireHandle();

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
        require$1(originModulePath, function (_moduleName, _callback) {

            return function () {
                if (!accessModule(_moduleName)) {
                    throw new Error("请检查模块名称是否正确!");
                }

                loadModuleHandle(_moduleName, accessModule, _callback);
            };
        }(moduleName, callback));
        return;
    }

    if (curModule.extend) {

        loadModuleHandle(curModule.extend, accessModule, function (extendModuleContrustor) {
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
var loadModule = function () {
    //moduleName, node, setting, callback, accessModule
    var args = [].slice.call(arguments);
    var accessModule = args.pop();

    if (type(args[1]) == "string") {
        args[1] = document.getElementById(args[1].substr(1));
    }

    loadModuleHandle(args[0], accessModule, function (_args) {

        return function (ModuleConstructor) {
            new ModuleConstructor(_args[0], _args[1], _args[2], _args[3]);
            accessModule(ModuleConstructor);
        };
    }(args));
};

var moduleCache = {};

var dataPriv = new Data();

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
var R = function R() {

    var args = [].slice.call(arguments);
    var cacheModule;
    var _initObj;

    /**
     * initFramwork
     */
    if (args.length == 1 && type(args[0]) == "object") {

        _initObj = args[0];

        extend(config, _initObj.config);

        R(_initObj.$module, _initObj.$mount, _initObj.setting || {}, noop);
    }

    /**
     * [length 我晕，，，忘了定于模块，导致加载不到模块]
     * @type {[type]}
     */
    if (args.length == 3 && type(args[2]) == "function") {

        dataPriv.access(moduleCache, args[0], {
            extend: args[1],
            module: args[2]
        });
    }

    /**
     * if loadModule
     * moduleName   模块名称
     * mountNode  模块所挂载的节点，必须是id
     * setting  加载模块所注入的配置,区分不同场景
     * callback 加载模块之后的回调
     */
    if (args.length == 4 && (/^#/.test(args[1]) || args[1].nodeType)) {

        cacheModule = dataPriv.access(moduleCache, args[0]);

        if (!cacheModule) {

            loadModule.apply(this, args.concat(function (moduleName) {

                /**
                 * 通过这个函数访问模块
                 * @param  {[type]} modeleContructor [模块构造器]
                 * @return {[type]}                  [description]
                 */
                return function accessModule(moduleOpt, _moduleName) {

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

/**
 * 添加插件
 * @param  {[function | object]} plugin  [插件对象]
 * @param  {[type]} options [插件配置对象]
 * @return {[type]}         [description]
 */
R.use = function (plugin, options) {

    if (type(plugin) == "object") {
        plugin = plugin.install;
    }

    plugin(BaseModule, options);
};
/*jshint ignore:start*/
window.R = R;
/*jshint ignore:end*/

})));
//# sourceMappingURL=framwork.js.map
