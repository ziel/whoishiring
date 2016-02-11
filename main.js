"use strict";

const WhosHiring = require('./lib/whoshiring'),
      Wrap       = require('word-wrap'),
      Plaintext  = require('html2plaintext'),
      Promise    = require('bluebird')

/**
 * Wrap output to this
 *
 * @see fmtitem()
 */
const wraplimit = 78

/**
 * Formats an html-like item for output.
 *
 * @param html
 * A string with some amount of html in it
 *
 * @return
 * A string with the html formatting removed
 */
function fmtitem(html) {
  let wrapopts = {width: wraplimit, indent: "  "}
  let output   = Wrap(Plaintext(html), wrapopts)
  return `\n\n---\n\n${output}`
}

/**
 * Returns the args passed on the cli as a single string
 *
 * @return string arguments
 */
function inputstring() {
  let args = process.argv.slice(2)
  return args.join(" ")
}


// --------------------------------------------
// main
// --------------------------------------------
{
  let term = inputstring()

  Promise.coroutine(function *() {
    console.log(yield WhosHiring.url())
    console.log(yield WhosHiring.title())

    let matches = yield WhosHiring.matches(term)
    matches.forEach(m => { console.log(fmtitem(m)) })
  })()
}
