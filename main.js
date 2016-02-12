"use strict";

const WhosHiring = require('./lib/whoshiring'),
      Format     = require('./lib/format'),
      Output     = require('./lib/output'),
      Spinner    = require('cli-spinner').Spinner,
      Promise    = require('bluebird')


let addnewline = (str) => str + "\n"
let terms = Format.args()

Promise.coroutine(function *() {
  Output.progress('Finding latest story...')

  let header = [
    addnewline(yield WhosHiring.url()),
    addnewline(yield WhosHiring.title())
  ]

  Output.progress(`Finding matches for: ${terms}`)

  let matches = yield WhosHiring.matches(terms)
  let results = matches.map(r => Format.html(r))

  Output.data(header.concat(results).join(''))
})()
