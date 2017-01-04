import Data from "./Data.js";
import BaseModule from "./BaseModule.js";

const moduleCache = {};

const cachePre = new Data();

cachePre.access(moduleCache);

cachePre.access(moduleCache,"BaseModule",{
  extend : null,

});

// 缓存module配置
const C = function(moduleName, extend, ModuleCallback) {

  cachePre.access(moduleCache,moduleName,BaseModule);

};

//暴露在全局
window.C = C;

export default C;
