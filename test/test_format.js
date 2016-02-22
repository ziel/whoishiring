'use strict'
/* eslint-env node, mocha */

const expect = require('chai').expect
const Format = require('../lib/format')

// ---------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------

// Generate an input string at the given length,
// using alternating chars and spaces for easy wrapping
//
// @param {number} length
// The desired length of the generated string
//
// @return {string}
// A string of alternating chars and spaces at the given length
//
let genstring = function (length) {
  let count = Math.floor(length / 2)
  let result = 'A '.repeat(count)

  if (length % 2 !== 0) {
    result += 'A'
  }

  return result
}

// ---------------------------------------------------------------
// Tests
// ---------------------------------------------------------------

describe('Format', function () {
  describe('Format.args', function () {
    it('should join argv[2:] into a string', function () {
      process.argv = ['bad', 'worse', 'ok1', 'ok2', 'ok3']

      const result = Format.args()
      const expected = 'ok1 ok2 ok3'
      expect(result).to.equal(expected)

      delete process.argv
    })
  })

  describe('Format.html', function () {
    it('should return tag free text', function () {
      const html = '<p>A thing</p><b>ok</b><hr>'
      const result = Format.html(html)
      expect(result).not.to.match(/[<>]/)
    })

    it('should wrap to n chars if asked', function () {
      const input = genstring(200)
      const limits = [ 20, 27, 78, 123, 13 ]

      for (let limit of limits) {
        // allowed is fuzzy: wrapping isn't exact
        const allowed = limit + 5
        const formatted = Format.html(input, limit)

        for (let line of formatted.split('\n')) {
          expect(line.length).to.be.below(allowed)
        }
      }
    })
  })
})
