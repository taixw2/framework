/**
 * BaseClass
 */

import createModule from "./createModule";


class Base {

  constructor () {

    this.version = "1.0.0";



    this.init = function(mod,ele,opt,callback)   {

        /*jshint ignore:start*/
        /*jshint ignore:end*/

        //终于执行到这里
        //在脑中运行真的是....
        this.onReady();

        this.onLoad();

        /**
         * 挂载到节点之后
         */
        this.onShow();
      };

  }

}

export default createModule(Base);
