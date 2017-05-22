import {isArray, noop} from "../utils.js"

const PENDING = "pending"
const SEALED = "sealed"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

const STATE = '[[PromiseStatus]]'
const VALUE = '[[PromiseValue]]'
const THENABLES = '[[PromiseThenables]]'

let asyncQueue = []
let timer

const asyncFlush = () => {
  for (let i = 0; i < asyncQueue.length; i++) {
    asyncQueue[i][0](asyncQueue[i][1])
  }

  timer = false
  asyncQueue = []
}


const asyncCall = (callback, promise) => {
    asyncQueue.push([callback, promise])

    if (!timer) {
        timer = true
        setTimeout(asyncFlush, 0)
    }

}


/**
 * 执行队列中的then
 */
const execThenables = (promise) => {
    const thens = promise[THENABLES]
    const value = promise[VALUE]
    const state = promise[STATE]
    promise[THENABLES] = []

    thens.forEach((subscriber) => {
        const promise_ = subscriber.then
        const value_ = subscriber[state](value)

        if (state === FULFILLED) {
          resolve(value_, promise_)
        }

    })
}

const fulfill = (value, promise) => {

    if (promise[STATE] === PENDING) {
        promise[STATE] = SEALED
        promise[VALUE] = value

        asyncCall(() => {
            promise[STATE] = FULFILLED
            execThenables(promise)
        }, promise)

    }
}

const resolve = (value, promise) => {
    if (value !== promise) {
        fulfill(value, promise)
    }

}

const reject = (value, promise) => {}

/**
 * 操作用户的resolver
 */
const invokeResolver = (resolver, promise) => {

    const resolverPromise = (value) => {
        resolve(value, promise)
    }

    const rejectPromise = (value) => {
        reject(value, promise)
    }

    try {

        /**
         * resolver拥有两个参数
         * resolve, reject
         */
        resolver(resolverPromise, rejectPromise)
    } catch (e) {
        rejectPromise(e)
    }

}

export default class Promise {

    constructor(resolver) {

        this[THENABLES] = []
        this[STATE] = PENDING
        this[VALUE] = null

        invokeResolver(resolver, this)

    }

    then(fulfilled = noop, rejected = noop) {
        const subscriber = {
            owner: this,
            then: new this.constructor(noop),
            fulfilled,
            rejected
        }


        /**
     * 把then加到队列中等待执行
     */
        this[THENABLES].push(subscriber)

        /**
     * 返回一个新的Promise
     */
        return subscriber.then
    }

    "catch" (onRejection) {
        this.then(noop, onRejection)
    }

    toString() {
        return "[object Promise]"
    }

}
