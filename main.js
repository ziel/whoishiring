#!/usr/bin/env node

'use strict'

const WhosHiring = require('./lib/whoshiring')
const Format = require('./lib/format')
const Output = require('./lib/output')
const Promise = require('bluebird')

// Add a newline to a string
//
// @param {string} str
// The string to add to
//
// @return {string}
// The given string with a newline appended
//
const addNewline = (str) => str + '\n'

// The search terms to use in the query
// (provided by the user)
//
const terms = Format.args()

// Main program
//
Promise.coroutine(function *() {
  Output.progress('Finding latest story...')

  let header = [
    addNewline(yield WhosHiring.url()),
    addNewline(yield WhosHiring.title())
  ]

  Output.progress(`Finding matches for: ${terms}`)

  let matches = yield WhosHiring.matches(terms)
  let results = matches.map((r) => Format.html(r))

  Output.data(header.concat(results).join(''))
})()
