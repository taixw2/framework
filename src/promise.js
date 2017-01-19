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
      promise.data_ = value;

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
