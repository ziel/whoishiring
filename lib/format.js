'use strict'

const Wrap = require('word-wrap')
const Plaintext = require('html2plaintext')

// Default wrap limit;
// Prefer the actual tty's columns if available,
// unless greater than MAX_COLUMNS
//
const MAX_COLUMNS = 80
const TTY_COLUMNS = process.stdout.columns || Infinity
const DEFAULT_WRAPLIMIT = Math.min(TTY_COLUMNS, MAX_COLUMNS)

// Indent string for wrapping
//
const INDENT_STRING = '  '

// Horizontal rule char
//
const HR_CHAR = '-'

// (Internal) cache for hr memoization.
// See hr() below
//
const _hrCache = new Map()

module.exports = {

  // Returns the args passed to the process
  // as a single string, (excluding the initial
  // process info bits of argv)
  //
  // @return {string} arguments
  //
  args () {
    let result = process.argv.slice(2)
    return result.join(' ')
  },

  // Retuns an ascii horizontal rule at the given width.
  // Uses the HR_CHAR const to form the string.
  //
  // @param {int} width
  // The width at which to make the rule
  //
  hr (width) {
    if (_hrCache.has(width)) {
      return _hrCache.get(width)
    }

    const result = HR_CHAR.repeat(width)
    _hrCache.set(width, result)

    return result
  },

  // Formats an html blob as plain text.
  //
  // @param {string} html
  // A string with some amount of html in it
  //
  // @param {number} wraplimit
  // (optional) Char limit for wrapping
  //
  // @return {string}
  // A string with the html formatting removed
  //
  html (input, wraplimit) {
    wraplimit = wraplimit || DEFAULT_WRAPLIMIT

    let opts = {
      width: wraplimit - (INDENT_STRING.length * 2),
      indent: INDENT_STRING
    }

    let divider = this.hr(wraplimit)
    let output = Wrap(Plaintext(input), opts)

    return `\n\n${divider}\n\n${output}`
  }
}
