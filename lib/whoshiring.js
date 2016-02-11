"use strict";

const HNSearch = require('hacker-news-api'),
      Promise  = require('bluebird')

Promise.promisifyAll(HNSearch)

// Internal constant search terms and such
//
const hackernews_url    = "https://news.ycombinator.com/item?id=",
      hackernews_author = "whoishiring",
      hackernews_search = "Who hiring"

/**
 * Internal cache for story info requests
 *
 * See story_info()
 */
let _story_info_cache = null

/**
 * Find the story metadata for the latest
 * Who's hiring thread on HN
 *
 * n.b. This method caches its result.
 *
 * @return
 * A Promise of a metadata object with the following fields:
 *    id: (number) the story id
 *    url: (string) the story url
 *    title: (string) the story title
 */
let story_info = function() {

  // Return a Promise for the first hn/algolia search result
  let search = function() {
    return HNSearch.
      ask_hn().
      author(hackernews_author).
      recent().
      hitsPerPage(1).
      searchAsync(hackernews_search)
  }

  // Construct and return the metadata object
  // from the search result
  let format_result = function(result) {
    let i     = result.hits[0]
    let id    = i && i.objectID
    let title = i && i.title

    return {
      id: id,
      url: hackernews_url + id,
      title: title
    }
  }

  if (_story_info_cache === null) {
    _story_info_cache = search().then(format_result)
  }

  return _story_info_cache
}

/**
 * Get the first 1000 comments matching the given search term(s)
 * for the given story_info metadata.
 *
 * See: story_info()
 *
 * @param story_info
 * (obj) the story_info obj from a story_info() resolution
 *
 * @param term
 * (string) terms to search for
 *
 * @return
 * A Promise of an array of html blurb results
 */
let matches = function(story_info, term) {

  // Search hn/algolia for the matching comments
  let search = function() {
    return HNSearch.
      story(story_info.id).
      comment().
      hitsPerPage(1000).
      searchAsync(term)
  }

  // Extract the comment text/html
  let extract = function(result) {
    return result.hits.map(r => r.comment_text)
  }

  return search().then(extract)
}

module.exports = {

  /**
   * Return the url of the most recent
   * Who's Hiring thread on Hacker News
   *
   * @return
   * Promise of a string url
   */
  url: function() {
    return story_info().then(s => s.url)
  },

  /**
   * Return the title of the most recent
   * Who's Hiring thread on Hacker News
   *
   * @return
   * Promise of a string title
   */
  title: function() {
    return story_info().then(s => s.title)
  },

  /**
   * Return search results from the most recent
   * Who's Hiring thread on Hacker News
   *
   * @return
   * Promise of an array of html blobs
   */
  matches: function(term) {
    return story_info().then(s => matches(s, term))
  },

  /**
   * Reset the story result cache.
   *
   * This is primarily useful for testing.
   */
  reset_story_cache: function() {
    _story_info_cache = null
  }
}
