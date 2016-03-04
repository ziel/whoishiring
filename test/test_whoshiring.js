'use strict'
/* eslint-env node, mocha */

const expect = require('chai').expect
const sinon = require('sinon')
const WhosHiring = require('../lib/whoshiring')
const HNSearch = require('hacker-news-api')

describe('WhosHiring', function () {
  // -------------------------------------------------------------
  // Fixtures
  // -------------------------------------------------------------

  const mockObjectID = 123
  const mockTitle = 'title text'
  const searchTerms = 'search terms'

  // Fake story result
  //
  const mockStorySearch = Promise.resolve({
    hits: [{
      objectID: mockObjectID,
      title: mockTitle
    }]
  })

  // Fake matches result
  //
  const mockMatches = [
    { comment_text: 'first comment' },
    { comment_text: 'second comment' },
    { comment_text: 'third comment' }
  ]

  const mockMatchesSearch = Promise.resolve({
    hits: mockMatches
  })

  // -------------------------------------------------------------
  // Sinon sandbox setup/teardown
  // -------------------------------------------------------------

  const sinonbox = sinon.sandbox.create({
    useFakeTimers: false,
    useFakeServer: false
  })

  // Before each test, stub and spy HNSearch methods
  //
  // Spies and Stubs notes:
  //   HNSearch.searchAsync is stubbed to provide
  //   the fixtures defined above
  //
  //   WhosHiring.url is spied
  //   WhosHiring.title is spied
  //
  beforeEach(function () {
    const searchAsync = sinonbox
      .stub(HNSearch, 'searchAsync')
      .returns(mockStorySearch)

    searchAsync
      .withArgs(searchTerms)
      .returns(mockMatchesSearch)

    sinonbox.spy(WhosHiring, 'url')
    sinonbox.spy(WhosHiring, 'title')
  })

  afterEach(function () {
    sinonbox.restore()
    WhosHiring.resetStoryCache()
  })

  // -------------------------------------------------------------
  // Tests
  // -------------------------------------------------------------

  describe('WhosHiring.url()', function () {
    it('should only call searchAsync once', function () {
      return Promise
        .resolve()
        .then(WhosHiring.url)
        .then(WhosHiring.url)
        .then(WhosHiring.url)
        .then((url) => {
          sinon.assert.calledThrice(WhosHiring.url)
          sinon.assert.calledOnce(HNSearch.searchAsync)
        })
    })

    it('should return a url with the mockObjectID', function () {
      return WhosHiring
        .url()
        .then((url) => {
          expect(url).to.match(new RegExp(`${mockObjectID}`))
        })
    })
  })

  describe('WhosHiring.title()', function () {
    it('should only call searchAsync once', function () {
      return Promise
        .resolve()
        .then(WhosHiring.title)
        .then(WhosHiring.title)
        .then(WhosHiring.title)
        .then((url) => {
          sinon.assert.calledThrice(WhosHiring.title)
          sinon.assert.calledOnce(HNSearch.searchAsync)
        })
    })

    it('should return a title with the mockTitle', function () {
      return WhosHiring
        .title()
        .then((title) => {
          expect(title).to.equal(mockTitle)
        })
    })
  })

  describe('WhosHiring.matches(terms)', function () {
    it('should return all matches ', function () {
      return WhosHiring
        .matches(searchTerms)
        .then((results) => {
          expect(results.length).to.equal(mockMatches.length)
        })
    })

    it('should return matches as strings', function () {
      return WhosHiring
        .matches(searchTerms)
        .then((results) => {
          results.forEach((result) => {
            expect(result).to.be.a('string')
          })
        })
    })

    it('should return matches from fixture', function () {
      const expected = mockMatches.map((m) => m.comment_text)

      return WhosHiring
        .matches(searchTerms)
        .then((results) => {
          expect(results).to.deep.equal(expected)
        })
    })
  })
})
