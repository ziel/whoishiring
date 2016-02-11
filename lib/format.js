"use strict";

const Wrap       = require('word-wrap'),
      Plaintext  = require('html2plaintext')


// Default wrap limit
const default_wraplimit = 80

module.exports = {

  /**
   * Returns the args passed to the process
   * as a single string, (excluding the initial
   * process info bits of argv)
   *
   * @return {string} arguments
   */
  args: function() {
    let result = process.argv.slice(2)
    return result.join(" ")
  },

  /**
   * Formats an html blob as plain text.
   *
   * @param {string} html
   * A string with some amount of html in it
   *
   * @param {number} wraplimit
   * (optional) Char limit for wrapping
   *
   * @return {string}
   * A string with the html formatting removed
   */
  html: function(input, wraplimit) {
    wraplimit = wraplimit || default_wraplimit

    let wrapopts = {width: wraplimit, indent: "  "}
    let output   = Wrap(Plaintext(input), wrapopts)
    return `\n\n---\n\n${output}`
  }
}
