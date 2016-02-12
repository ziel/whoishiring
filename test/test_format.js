"use strict";

const expect = require('chai').expect,
      sinon  = require('sinon'),
      Format = require('../lib/format')


// ---------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------

/**
 * Generate an input string at the given length,
 * using alternating chars and spaces for easy wrapping
 *
 * @param {number} length
 * The desired length of the generated string
 *
 * @return {string}
 * A string of alternating chars and spaces at the given length
 * (Length is exact for even requests, -1 for odd requests)
 */
let genstring = function(length) {
  let count = Math.floor(length/2)
  let result = ""

  while (count--) {
    result += "A "
  }

  if (length % 2 != 0) {
    result += "A"
  }

  return result
}

// ---------------------------------------------------------------
// Tests
// ---------------------------------------------------------------

describe("Format", function() {

  describe("Format.args", function() {
    it("should join argv[2:] into a string", function() {
      process.argv = ["bad", "worse", "ok1", "ok2", "ok3"]

      let result = Format.args()
      let expected  = "ok1 ok2 ok3"
      expect(result).to.equal(expected)

      process.argv = undefined
    })
  })

  describe("Format.html", function() {

    it("should return tag free text", function() {
      let html = "<p>I'm a thing</p><b>ok</b><hr>"
      let result = Format.html(html)
      expect(result).not.to.match(/[<>]/)
    })

    it("should wrap to n chars if asked", function() {
      let input = genstring(200)
      let limits = [ 20, 27, 78, 123, 13 ]

      for (let limit of limits) {
        let allowed = limit + 5 // fuzzy, wrapping isn't exact
        let formatted = Format.html(input, limit)

        for (let line of formatted.split("\n")) {
          expect(line.length).to.be.below(allowed)
        }
      }
    })
  })
})
