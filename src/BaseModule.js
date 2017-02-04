/**
 * BaseClass
 */

import createModule from "./createModule";
import require from "./require";


class Base {

  constructor () {

    this.version = "1.0.0";



    this.init = function(mod,ele,opt,callback)   {

        /*jshint ignore:start*/
        /*jshint ignore:end*/

        //终于执行到这里
        //在脑中运行真的是....
        this.onReady();


        //js被加载后执行这个方法
        //this.onLoad();

        // console.log(require);

        /**
         * 挂载到节点之后
         */
        this.onShow();
      };

  }

}

export default createModule(Base);
