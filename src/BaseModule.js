/**
 * BaseClass
 */

import createModule from "./createModule";
import {noop} from "./utils";


class Base {

  constructor () {

    this.version = "1.0.0";

    this.onLoad = noop;
    this.onReady = noop;

    this.init = function(mod,ele,opt,callback)   {

        /*jshint ignore:start*/
        /*jshint ignore:end*/

        //终于执行到这里
        //在脑中运行真的是....
        this.onReady();


        /**
         * 处理一系列事情之后
         */
        this.onLoad();
      };

  }

}

export default createModule(Base);
