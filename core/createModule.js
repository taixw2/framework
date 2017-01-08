import {
    extend,
    type
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

    Constructor.prototype.main = function() {

      throw new Error("main方法未实现");

    };

    extend(Constructor.prototype, new subModule());

    Constructor.prototype.constructor = subModule;

    return Constructor;

}
