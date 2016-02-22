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

  let spyURL
  let spyTitle
  let stubSearch

  beforeEach(function () {
    spyURL = sinonbox.spy(WhosHiring, 'url')
    spyTitle = sinonbox.spy(WhosHiring, 'title')

    stubSearch = sinonbox.stub(HNSearch, 'searchAsync')
    stubSearch.returns(mockStorySearch)
    stubSearch.withArgs(searchTerms).returns(mockMatchesSearch)
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
          sinon.assert.calledThrice(spyURL)
          sinon.assert.calledOnce(stubSearch)
        })
    })

    it('should return a url with the mockObjectID', function () {
      return WhosHiring
        .url()
        .then((url) => {
          expect(url).to.match(new RegExp(`${mockObjectID}`))
          sinon.assert.calledOnce(stubSearch)
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
          sinon.assert.calledThrice(spyTitle)
          sinon.assert.calledOnce(stubSearch)
        })
    })

    it('should return a title with the mockTitle', function () {
      return WhosHiring
        .title()
        .then((title) => {
          expect(title).to.equal(mockTitle)
          sinon.assert.calledOnce(stubSearch)
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
