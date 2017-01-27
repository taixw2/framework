// import {
//   isArray,
//   noop
// } from "./utils.js";

const noop = function () {};
const PENDING = "pending";
const SEALED = "sealed";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";


function invokeResolver(resolver,promise) {

  function resolverPromise(value) {
    if (promise.state === PENDING) {
      promise.data = value;
      promise.state = FULFILLED;
      thenCall(promise);
    }

  }

  function rejectPromise(reason) {
    if (promise.state === PENDING) {
        promise.data = reason;
        promise.state = REJECTED;
        thenCall(promise);
    }
  }

  try {
    resolver(resolverPromise,rejectPromise);
  } catch (e) {
    rejectPromise(e);
  }

}

function thenCall(promise) {

  let thens = promise._then;
  let type;

  if (promise.state === REJECTED) {
    type = "fulfilled";
  } else {
    type = "rejected";
  }

  for (let i = 0; i < thens.length; i++) {
    asycnCall(thens[i],type,promise.data);
  }
  promise._then = [];
}

function asycnCall(thenAbel,type,data) {
    thenAbel[type](data);
}


class Promise{

  constructor (resolver) {

    this._then = [];
    this.data = null;
    this.state = PENDING;

    invokeResolver(resolver,this);

  }

  then (fulfilled = noop, rejected = noop) {

    const subscriber = {
      owrn : this,
      then : new Promise(noop),
      fulfilled,
      rejected
    };

    if (this.state === FULFILLED || this.state === REJECTED) {
      thenCall(subscriber);
    } else {
      this._then.push(subscriber);
    }
    return subscriber.then;
  }

  "catch" (onRejection) {
    this.then(noop,onRejection);
  }

  toString () {
    return "[object Promise]";
  }

}

const promise = new Promise(function(fulfill,reject){
  setTimeout(()=>{
    fulfill(123);
  },2000);
});
promise.then(res=>{
  console.log(res);
},res=>{
  console.log(res);
});
