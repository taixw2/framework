import {
    extend,
    type,
    noop
} from "./utils";

export default function(subModule, supModule) {


    var Constructor = function() {

        if (this.init) this.init.apply(this, arguments);

    };

    if (type(supModule) == "function") {

        var F = function() {};

        F.prototype = supModule.prototype;

        Constructor.prototype = new F();

        F = null;
    }

    extend(
      Constructor.prototype,
      {
        /**
         * [每个模块需要重写以下方法，无法从父模块继承]
         * onReady 模块引入后执行
         * onLoad 模块构造器执行之后执行
         * onShow 模块挂载到节点后执行
         */
        onReady : noop,
        onLoad :noop,
        onShow : noop
      },
      new subModule()
    );

    Constructor.prototype.constructor = subModule;

    return Constructor;

}
