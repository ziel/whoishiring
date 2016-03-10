#!/usr/bin/env node

'use strict'

const WhosHiring = require('./lib/whoshiring')
const Format = require('./lib/format')
const Output = require('./lib/output')
const Promise = require('bluebird')

// The search terms to use in the query
// (provided by the user)
//
const terms = Format.args()

// Main program
//
Promise.coroutine(function *() {
  Output.progress('Finding latest story...')

  const meta = [
    yield WhosHiring.url(),
    yield WhosHiring.title()
  ]

  Output.progress(`Finding matches for: ${terms}`)

  const matches = yield WhosHiring.matches(terms)
  const results = matches.map(Format.html)
  const header = meta.join('\n')

  Output.data(header + results.join(''))
})()
