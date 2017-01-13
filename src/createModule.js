import {
    extend,
    type,
    noop
} from "./utils";

export default function(subModule, supModule) {

    //模块构造器
    var ModuleConstructor = function() {
        if (this.init)
          this.init.apply(this, arguments);
        else
          console.warn("该模块没有继承BaseClass");
    };

    if (type(supModule) == "function") {

        var F = function() {};

        F.prototype = supModule.prototype;

        ModuleConstructor.prototype = new F();

        F = null;
    }

    extend(
      ModuleConstructor.prototype,
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

    ModuleConstructor.prototype.constructor = subModule;

    return ModuleConstructor;

}
