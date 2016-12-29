/**
 * 整体雏形
 */
import {type,uuid,each,noop,every} from require("./utils");

export default function() {

  if (typeof require !== "undefined" && typeof define != "undefined") {
    return;
  }

  var modulesCache = {};
  var doc = document;
  var body = doc.body;
  var superScript = document.currentScript ? true : false;
  var defaultConfig = {
    baseUrl : "/"
    paths : { },
    waitSeconds : 0,
    shim : {}
  }

  /**
   * require 处理
   */
  function requireHandle (path,callback) {
      //精准路径
      var exactPath;
      var config = _require.config;
      var id;
      if (matchUrl(path) === false) {

        if (type(config.paths[path]) === "undefined") {
            throw "加载模块路径错误";
        }  else {
          exactPath = config.baseUrl + config.paths[path]
        }

      } else {
          exactPath = path;
      }

      id = config.paths[path] || path;

      if (type(moduleCache[id]) !== "undefined") {
        return moduleCache[id];
      }
      loadScript(exactPath,callback,id);
  }

  /**
   * 加载脚本
   */
  function loadScript(path,callback,id) {

    var script = document.createElement;
    // var currentScript = document.currentScript;
    // var id = id || uuid;
    // script.id = id;
    script.src = path;
    script.id = id;

    registDep(id,callback);

    script.onload = function(_script) {
      return function () {
        script.onload = null;
        // callback();
        removeScript();
      }
    } (script);
    body.appendChild(script);
  }

  /**
   * 删除脚本
   */
  function removeScript(script) {

    if (type(script.remove) === "undefined") {
        script.parentNode.removeChild(script)
    } else {
      script.remove();
    }
  }

  //require 只发布一个对象，而对象的回调在define中执行
  function _require(modules,callback) {

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
    } else if(type(modules) === "array") {

      depHandler(modules,function(){
        //依赖加载完的回调
      });


    }

  }


  /**
   * require缓存所有依赖
   */
  function registDep(depName,callback,result) {

    var dep = modulesCache[depName];

    if (dep) {
        if (dep.status === "loaded") {
          callback(dep.result);
        } else {
          dep.callbacks.push(callback);
        }
        return;
    }

    //每次require时都把require的回调保存起来，等到依赖加载完成则遍历执行这些回调
    //如果status已经加载完则立即执行回调
    modulesCache[depName] = {
      name : depName,
      callbacks : callback && [callback] || [],
      status : "pending",
      result : result && result || null //执行成功之后把执行结果缓存起来，方便下次require的时候直接把结果传到回调中
    };
  }

  //define时执行依赖
  function execDep(depName,result) {
    var dep = modulesCache[depName];
    var callback;
    dep.status = "loaded";
    if (dep) {
      while (callback = dep.callback.shift()) {
        callback(result);
      }
      dep.result = result;
      return;
    }
    registDep(depName,"",result);
  }


  //对依赖的处理
  function depHandler (modules,callback = noop) {
    var params = [];
    var start = 0;
    var l = modules.length;

    if (!l) {
      callback();
      return;
    }

    each (modules,(v,i)=> {
      requireHandle(v,function(_i){
        return function(param){
          //执行define的时候会执行这个回调
          //表示loaded
          start++;
          params[_i] = param;
          if (start === l) {
            callback.apply(null,params);
          }
        }
      }(i))
    });
  }


  //执行define,
  // 判断当前所执行的脚本的id找出require中注册的moduleCache
  // 执行对应的callback
  function _define(namespace,deps,callback) {

    var dependents = [];
    var namespace = arguments[0];
    var args = [].slice.call(arguments,1);
    var currentScript = document.currentScript;
    var stack;
    var DOC = document;
    var i,l;

    var arg1IsNamespace = namespace && type(namespace) === "string";

    if (superScript && !arg1IsNamespace) {
      //兼容不支持document.currentScript < IE 9
      // 详见 ： http://www.cnblogs.com/rubylouvre/archive/2013/01/23/2872618.html
      try {
        强制报错
      } catch (e) {
        stack = e.stack;
        if(!stack && window.opera){
            //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
            stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
        }
      }
      if (stack) {
        stack = stack.split( /[@ ]/g).pop();
        stack = stack[0] == "(" ? stack.slice(1,-1) : stack;
        stackUrl = stack.replace(/(:\d+)?:\d+$/i, "");

        scripts = DOC.scripts;
        i = 0;
        l = scripts.length;
        for (; i < l; i++) {
          if (scripts[i] === stackUrl) {
            currentScript = {
              id : scripts[i].id
            }
            break;
          }
        }
      } else {
        throw "超过所支持浏览器范畴，浏览器信息:" + navigator.userAgent
      }
    }

    if (currentScript && arg1IsNamespace) {
      if (currentScript.id !== namespace) {
        throw "定义模块命名空间与引入模块别名不一致"；
      }
    }

    var _defineModule = {
      namespace : namespace && type(namespace) === "string" ? namespace : currentScript.id
      parms : [],
      callback : function(){}
    }

    switch ("array") {
      case type(namespace):
        dependents = namespace;
        break;
      case type(deps):
        if(every(deps,(v)=>!v)) {
          dependents = false;
        } else {
          dependents = deps;
        }
        break;
      default:
        dependents = false;
    }


    //有依赖则要等到依赖加载完之后再缓存
    if (type(dependents) === "boolean") {
      //没有依赖
      switch (type(namespace)) {
        case "object":
          _defineModule.callback = new Function(`
              return ${namespace}
            `);
          break;
        case "function":
          _defineModule.callback = namespace;
          break;
        case "string":
          //deps : function callback : undefined
          //deps : array callback : function
          if (type(deps) === "function" ) {
            _defineModule.callback = deps；
          } else {
            _defineModule.callback = callback;
          }
          break;
        default:
        //not default
      }
      execDep(_defineModule.namespace,_defineModule.callback());
    } else {
      depHandler(dependents,function(){
        _defineModule.namespace = type(namespace) === "array" ? _defineModule.namespace : namespace;
        //bind 返回一个保存着所有依赖的函数
        _defineModule.callback =  args[args.length - 1].bind(null,arguments);
        execDep(_defineModule.namespace,_defineModule.callback());
      });

    }
  }


  function matchUrl (url) {
    return url.match(/.*:\/\/|^\/\//) ? true : false;
  }


  _require.config = defaultConfig;

  window.require = _require;
  window.define = _define;


}
