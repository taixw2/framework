import {
  isArray,
  noop
} from "./utils.js";

export class Promise{

  constructor () {

    this._then = [];

  }

  then (onFulfillment = noop, onRejection = noop) {

  }

  "catch" (onRejection) {
    this.then(noop,onRejection);
  }

}
