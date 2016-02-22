'use strict'

const HNSearch = require('hacker-news-api')
const Promise = require('bluebird')

Promise.promisifyAll(HNSearch)

// Internal constants
//
const HACKERNEWS_URL = 'https://news.ycombinator.com/item?id='
const HACKERNEWS_AUTHOR = 'whoishiring'
const HACKERNEWS_SEARCH = 'who hiring'

// Internal cache for story info requests
//
// See storyInfo()
//
let _storyInfoCache = null

// Find the story metadata for the latest
// Who's hiring thread on HN
//
// n.b. This method caches its result.
//
// @return {Promise<Object>}
// A Promise of a metadata object with the following fields:
//    id: {number} the story id
//    url: {string} the story url
//    title: {string} the story title
//
const storyInfo = function () {
  // Extract results from HNSearch result
  //
  const extract = function (result) {
    const hit = result.hits[0]
    const objectID = hit && hit.objectID

    return {
      id: objectID,
      url: HACKERNEWS_URL + objectID,
      title: hit && hit.title
    }
  }

  if (_storyInfoCache === null) {
    _storyInfoCache = HNSearch
      .ask_hn()
      .author(HACKERNEWS_AUTHOR)
      .recent()
      .hitsPerPage(1)
      .searchAsync(HACKERNEWS_SEARCH)
      .then(extract)
  }

  return _storyInfoCache
}

// Get the first 1000 comments matching the given search term(s)
// for the given storyInfo metadata.
//
// See: storyInfo()
//
// @param {object} storyInfoResult
// A storyInfoResult from a storyInfo() resolution
//
// @param {string} terms
// Terms to search for
//
// @return {Promise<array<string>>}
// A Promise of an array of html blurb results
//
const matches = function (storyInfoResult, terms) {
  // Extract results from HNSearch result
  //
  const extract = function (result) {
    return result.hits.map((r) => r.comment_text)
  }

  return HNSearch
    .story(storyInfoResult.id)
    .comment()
    .hitsPerPage(1000)
    .searchAsync(terms)
    .then(extract)
}

module.exports = {

  // Return the url of the most recent
  // Who's Hiring thread on Hacker News
  //
  // @return {Promise<string>}
  // A Promise of a url
  //
  url () {
    return storyInfo().then((s) => s.url)
  },

  // Return the title of the most recent
  // Who's Hiring thread on Hacker News
  //
  // @return {Promise<string>}
  // A Promise of a title
  //
  title () {
    return storyInfo().then((s) => s.title)
  },

  // Return search results from the most recent
  // Who's Hiring thread on Hacker News
  //
  // @return {Promise<array<string>>}
  // A Promise of an array of html blobs
  //
  matches (term) {
    return storyInfo().then((s) => matches(s, term))
  },

  // Reset the internal story result cache.
  //
  // n.b.
  // This is primarily useful for testing.
  //
  resetStoryCache () {
    _storyInfoCache = null
  }
}
