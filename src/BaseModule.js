/**
 * BaseClass
 */

import createModule from "./createModule";

class Base {

  constructor () {

    this.version = "1.0.0";

  }
  init (mod,ele,opt,callback)   {

    /*jshint ignore:start*/
    console.log(arguments);
    /*jshint ignore:end*/
    
    //终于执行到这里
    //在脑中运行真的是....

  }
}

export default createModule(Base);
