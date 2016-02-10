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
 * Print the given var to the console.
 *
 * n.b. This is useful because console.log will
 *      accept additional variables, but this supresses
 *      that behavior, printing only the one variable.
 */
function println(output) {
  console.log(output)
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
    println(yield WhosHiring.url())
    println(yield WhosHiring.title())

    let matches = yield WhosHiring.matches(term)
    matches.forEach(m => { println(fmtitem(m)) })
  })()
}
