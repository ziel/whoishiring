'use strict'

const Wrap = require('word-wrap')
const HTML2Text = require('html-to-text')
const SanitizeHTML = require('sanitize-html')

// Default max width for output text wrapping
// Prefer the actual tty's columns if available,
// unless greater than MAX_COLUMNS
//
const MAX_COLUMNS = 80
const TTY_COLUMNS = process.stdout.columns || Infinity
const DEFAULT_MAXWIDTH = Math.min(TTY_COLUMNS, MAX_COLUMNS)

// Settable holder for configured max width
// @see setMaxWidth() in exports
//
let maxWidth = DEFAULT_MAXWIDTH

// Indent string for wrapping
//
const INDENT_STRING = '  '

// Horizontal rule char
//
const HR_CHAR = '-'

// (Internal) cache for hr memoization.
// See hr() below
//
const hrMemoTable = new Map()

// Retuns an ascii horizontal rule at the given width.
// Uses the HR_CHAR const to form the string.
//
// @param {int} width
// The width at which to make the rule
//
const hr = function (width) {
  if (hrMemoTable.has(width)) {
    return hrMemoTable.get(width)
  }

  const result = HR_CHAR.repeat(width)
  hrMemoTable.set(width, result)

  return result
}

// Return nicely formatted plain text for
// the given html.
//
// @param {string} html
// The html to format as plain text
//
// n.b. This adds a wrapping and sanitization
//      step to the html because the html
//      returned from algolia/HN is wonky
//
const plaintext = function (html) {
  let wrapped = `<p>${html}</p>`
  let sanitized = SanitizeHTML(wrapped)

  return HTML2Text.fromString(sanitized, {
    wordwrap: false,
    hideLinkHrefIfSameAsText: true
  })
}

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

  // Formats an html blob as plain text.
  //
  // @param {string} html
  // A string with some amount of html in it
  //
  // @return {string}
  // A string with the html formatting removed
  //
  html (input) {
    let opts = {
      width: maxWidth - (INDENT_STRING.length * 2),
      indent: INDENT_STRING
    }

    let divider = hr(maxWidth)
    let output = Wrap(plaintext(input), opts)

    return `\n\n${divider}\n\n${output}`
  },

  // Sets the max width for output text wrapping.
  // Will reset to the default if the given width
  // isn't truthy.
  //
  // @param {int} width
  // The max width to set
  //
  setMaxWidth (width) {
    maxWidth = width || DEFAULT_MAXWIDTH
  }
}
