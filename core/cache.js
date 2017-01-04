//参考jquery.data设计
import {
    uuid,
    type,
    each,
    isArray
} from "./utils";

export class Data {

    constructor() {
        this.expando = uuid();
    }
    cache(owner) {
        var value = owner[this.expando];
        if (!value) {

            Object.defineProperty(owner, this.expando, {
                value: value,
                configurable: true //允许使用delete 删除
            });

        }
        return value;

    }
    set(owner, data, value) {
        var prop,
            cache = this.cache(owner);

        if (type(data) == "string") {
            cache[data] = value;
        } else {
            each(data, (val, key) => {
                cache[key] = val;
            });
        }

    }
    get(owner, key) {

        return type(key) == "undefined" ?
            this.cache(owner) :

            owner[this.expando] && owner[this.expando][key];

    }

    access(owner, key, value) {

        if (type(key) == "undefined" ||
            (type(key) == "string" && type(value) == "undefined")) {

            return this.get(owner, key);
        }


        this.set(owner, key, value);
    }
    remove(owner, key) {

        var cache = owner[this.expando];

        if (type(cache) == "undefined") {
            return;
        }

        if (type(key) != "undefined") {

            if (!isArray(key)) {
              key = key in cache ? [ key ] : [];
            }

            while (key) {
                delete cache[key.shift()];
            }
        }
    }
}
