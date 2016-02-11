"use strict";

const WhosHiring = require('./lib/whoshiring'),
      Format     = require('./lib/format'),
      Promise    = require('bluebird')


let terms = Format.args()

Promise.coroutine(function *() {
  console.log(yield WhosHiring.url())
  console.log(yield WhosHiring.title())

  let results = yield WhosHiring.matches(terms)
  results.forEach(r => console.log(Format.html(r)))
})()
