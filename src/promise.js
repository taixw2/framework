import {
  isArray,
  noop
} from "./utils.js";

const PENDING = "pending";
const SEALED = "sealed";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

let asyncQueue = [];
let asyncTimer = false;

function invokeResolver(resolver,promise) {

  function resolverPromise(value) {

    if (promise.state_ === PENDING) {
      promise.state_ = SEALED;
      promise.data_ = value;
      asyncCall(publishFulfillment,promise);
    }
  }

  function rejectPromise(reason) {

  }
  try {
    resolver(resolverPromise,rejectPromise);
  } catch (e) {
    rejectPromise(e);
  }

}

function asyncCall(callback,args) {
  var promiseCallback;
  asyncQueue.push([callback,args]);

  if (!asyncTimer) {
      asyncTimer = true;
      /*jshint ignore:start*/
      while (promiseCallback = asyncQueue.shift()) {
        promiseCallback[0](promiseCallback[1])
      }
      /*jshint ignore:end*/
      asyncQueue = [];
      asyncTimer = false;
  }
}


function publishFulfillment(promise){
  var callbacks = promise._then;
  var callback;
  promise.state_ = FULFILLED;

  /*jshint ignore:start*/
  while (callback = callbacks.shift()) {

  }
  /*jshint ignore:end*/
}

export class Promise{

  constructor (resolver) {

    this._then = [];

    invokeResolver(resolver,this);

  }

  then (fulfilled = noop, rejected = noop) {



  }

  "catch" (onRejection) {
    this.then(noop,onRejection);
  }

  toString () {
    return "[object Promise]";
  }

}
