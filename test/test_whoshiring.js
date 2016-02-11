"use strict";

const expect  = require('chai').expect,
      sinon   = require('sinon'),
      mockery = require('mockery'),
      WhosHiring = require('../lib/whoshiring'),
      HNSearch = require('hacker-news-api')


describe("WhosHiring", function() {

  // ----------------------------------
  // todo: docs fixtures
  // ----------------------------------

  const mock_objectID = 123,
        mock_title    = "title text",
        search_terms  = "search terms"

  const mock_storysearch = Promise.resolve({
    hits: [{
      objectID: mock_objectID,
      title:    mock_title
    }]
  })

  const mock_matches = [
    { comment_text: "first comment" },
    { comment_text: "second comment" },
    { comment_text: "third comment" }
  ]

  const mock_matchessearch = Promise.resolve({
    hits: mock_matches
  })

  // ----------------------------------
  // todo: docs spy setup
  // ----------------------------------

  let sinonbox = sinon.sandbox.create({
    useFakeTimers: false,
    useFakeServer: false
  })

  let spy_url,
      spy_title,
      spy_matches,
      stub_search

  beforeEach(function() {
    spy_url     = sinonbox.spy(WhosHiring, "url")
    spy_title   = sinonbox.spy(WhosHiring, "title")
    spy_matches = sinonbox.spy(WhosHiring, "matches")

    stub_search = sinonbox.stub(HNSearch, "searchAsync")
    stub_search.returns(mock_storysearch)
    stub_search.withArgs(search_terms).returns(mock_matchessearch)
  })

  afterEach(function() {
    sinonbox.restore()
    WhosHiring.reset_story_cache()
  })

  // ----------------------------------
  // tests
  // ----------------------------------

  describe("WhosHiring.url()", function() {
    it("should only call searchAsync once", function() {
      return Promise.resolve().
        then(WhosHiring.url).
        then(WhosHiring.url).
        then(WhosHiring.url).
        then(url => {
          sinon.assert.calledThrice(spy_url)
          sinon.assert.calledOnce(stub_search)
        })
    })

    it("should return a url with the mock_objectID", function() {
      return WhosHiring.url().
        then(url => {
          expect(url).to.match(new RegExp(`${mock_objectID}`))
          sinon.assert.calledOnce(stub_search)
        })
    })
  })

  describe("WhosHiring.title()", function() {
    it("should only call searchAsync once", function() {
      return Promise.resolve().
        then(WhosHiring.title).
        then(WhosHiring.title).
        then(WhosHiring.title).
        then(url => {
          sinon.assert.calledThrice(spy_title)
          sinon.assert.calledOnce(stub_search)
        })
    })

    it("should return a title with the mock_title", function() {
      return WhosHiring.title().
        then(title => {
          expect(title).to.equal(mock_title)
          sinon.assert.calledOnce(stub_search)
        })
    })
  })

  describe("WhosHiring.matches(terms)", function() {
    it("should return all matches ", function() {
      return WhosHiring.matches(search_terms).
        then(results => {
          expect(results.length).to.equal(mock_matches.length)
        })
    })

    it("should return matches as strings", function() {
      return WhosHiring.matches(search_terms).
        then(results => {
          results.forEach(result => {
            expect(result).to.be.a('string')
          })
        })
    })

    it("should return matches from fixture", function() {
      let expected = mock_matches.map(m => m.comment_text)

      return WhosHiring.matches(search_terms).
        then(results => {
          expect(results).to.deep.equal(expected)
        })
    })
  })
})
