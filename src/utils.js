var objToStr = ({}).toString;
var class2type = {};
var typeList = "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ");
for (var i = 0; i < typeList.length; i++) {
    class2type["[object " + typeList[i] + "]"] = typeList[i].toLowerCase();
}

export const uuid = function(fix = "iqqq") {
    return fix + "_" + Math.random().toString(16).substr(2);
};

/**
 * 判断参数类型
 */
export const type = function(arg) {

    var _type = typeof arg;

    if (_type !== "object") {
        return _type;
    }
    return class2type[objToStr.call(arg)];

};


/**
 * 判断是否数组
 */
export const isArray = function(obj) {
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
export const each = function(arg, callback, context) {

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

export const every = function(arr, callback, context) {
    var i = 0;
    var l;
    if (type(arr) !== "array") {
        return arr;
    } else if (type(arr.every) !== "undefined") {
        arr.every(callback, context);
    } else {
        l = arr.length;
        for (; i < l; i++) {
            // arr[i]
            if (!callback(arr[i], i)) {
                return false;
            }
        }
        return true;
    }
};

export const noop = function() {};
//

 export const extend = function() {

     var args = [].slice.call(arguments);
     var target = args.shift();
     var l = args.length;
     var deep = false;
     var copy;
     var clone;
     var i = 0;
     var option;
     var k;
     var callback = noop;

     //最后一个如果是回调
     if (type(args[l-1]) == "function") {
       callback = args.pop();
     }

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

                 if ( callback(copy,k) === true) {
                   continue;
                 }

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
