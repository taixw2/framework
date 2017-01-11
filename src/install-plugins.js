import {
    type,
    extend,
} from "./utils";


/**
 * 安装插件
 * @param  {[type]} plugin  [安装插件回调]
 * @param  {[type]} options [安装插件所传入的配置]
 * @return {[type]}         [description]
 */
export default function(BaseModule){

  return function(
    plugins,
    options
  ){

    if ( type(plugins) == "object" ) {
        plugins = plugins.install;
    }

    if ( type(plugins) == "function" ) {
        plugins = plugins(options);
    }

    extend(BaseModule.prototype,plugins,function(v,k){

      if (BaseModule.prototype[k]) {
        console.warn("禁止篡改已经存在的方法");
        return true;
      }

    });

  };



}
