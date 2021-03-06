export default class PubSub {
    constructor() {
        this.handles = {};
    }
    $on(eventType, handle) {
        var handles = this.handles[eventType];
        if (!(eventType in this.handles)) {
            this.handles[eventType] = {
                memory: null,
                callbacks: []
            };
            handles = this.handles[eventType];
        }

        if (handles.memory) {
            handle.apply(this, this.handles[eventType]);
            return;
        }

        handles.callbacks.push(handle);

    }
    $emit(eventType) {
        var args = [].slice.call(arguments, 1);
        var handles = this.handles[eventType];
        var handle;

        if (!eventType || !handles) {
            throw new Error(eventType + "对象不存在");
        }

        handles.memory = args;

        handle = handles.callbacks;
        while ( handle.length ) {
            handle.shift().apply(this, args);
        }
    }
}
