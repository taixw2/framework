/**
 * 整体雏形
 */
import {
    type,
    uuid,
    each,
    noop,
    every
} from "./utils";
import PubSub from "./PubSub";

export default function() {

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
                throw new Error("加载模块路径错误");
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

        script.onload = function(_script, _id, _exp) {
            return function() {
                script.onload = null;
                // callback();
                removeScript();

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

        if (
            type(modules) === "function" ||
            (!modules && type(callback) === "function")
        ) {
            return modules();
        } else if (type(modules) === "string") {

            modules = [modules];

        }

        depHandler(modules, function() {
            //依赖加载完的回调
            callback.apply(this, arguments);
        });
    }

    //仅用于内部
    function _coreRequire(modules, callback) {

        depHandler([modules], function() {
            //依赖加载完的回调
            callback.apply(this, arguments);

        }, true);

    }


    //对依赖的处理
    function depHandler(modules, callback = noop, _private = false) {
        var params = [];
        var start = 0;
        var l = modules.length;

        if (!l) {
            callback();
            return;
        }

        each(modules, (v, i) => {
            requireHandle(v, _private, function(_i) {
                return function(param) {
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
            callback: function() {}
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

            depHandler(normParam.deps, function() {
                pubSub.$emit(
                    normParam.namespace,
                    normParam.callback.bind(null, arguments)()
                );
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
            namespace,
            deps,
            callback
        };

    }

    function matchUrl(url) {
        return url.match(/.*:\/\/|^\/\//) ? true : false;
    }


    _require.config = defaultConfig;

    window.require = _require;
    window.define = _define;


    return _coreRequire;
}
