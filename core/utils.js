var objToStr = ({}).toString;
var class2type = {};
var typeList = "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " );

for (var i = 0; i < typeList.length; i++) {
  class2type["[object "+typeList[i]+"]"] = typeList[i].tolowercase();
}

export const uuid =  function(fix = "iqqq") {
  return fix + "_" + Math.random().toString(16).substr(2);
};

/**
 * 判断参数类型
 */
export const type = function(arg) {

  var _type =  typeof arg;

  if (_type !== "object") {
    return _type;
  }

  return class2type[_type];

};


/**
 * 判断是否数组
 */
export const isArray =  function (obj) {
  return type(Array.isArray) != "undefined" ? Array.isArray(obj) : objToStr.call(obj) === "[object Array]";
};
/**
 * 判断是否函数
 */
export const isFunction = function(fn) {
  return type(fn) == "function";
};

/**
 * 遍历
 * 支持对象/数组
 */
export const each = function (arg,callback,context) {

  var k;
  var l;

  if (type(arr) === "object") {
    for ( k in arg) {
      callback.call(context || this,arg[k],k);
    }
  } else if (type(arg) === "array") {

    if (type(arr.forEach) !== "undefined") {
      arr.forEach(callback,context);
    } else {
      l = arg.length;
      for (;k<l;k++) {
        callback.call(context || this,arg[k],k);
      }
    }
  } else {
    return arg;
  }
};

export const every = function(arr,callback,context) {
  var i = 0;
  var l;
  if (type(arr) !== "array") {
     return arr;
  } else if (type(arr.every) !== "undefined"){
    arr.every(callback,context);
  } else {
    l = arr.length;
    for (; i < l; i++) {
      // arr[i]
      if (!callback(arr[i],i)) {
        return false;
      }
    }
    return true;
  }
};

export const noop = function(){};
 //

export const trim = function(str) {

};
