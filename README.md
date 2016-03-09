[![Build Status](https://travis-ci.org/ziel/whoishiring.svg?branch=master)](https://travis-ci.org/ziel/whoishiring)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![js-strict-standard-style](https://img.shields.io/badge/code%20style-strict%20standard-117D6B.svg)](https://github.com/denis-sokolov/strict-standard)

whoishiring
===========

Search the latest [Hacker News](news.ycombinator.com) _Who is Hiring_ thread using the [Algolia search API](https://hn.algolia.com/api). Get plain text results in the comfort of the cli, for maximum coziness.

installation
------------

This wants [npm](npmjs.com).

```
npm install whoishiring
```

usage
-----
```
whoishiring my search terms
```

Here are some example searches:

```
whoishiring elixir

whoishiring java austin

whoishiring some-company-name

```

notes and caveats
-----------------

`whoishiring` tries to find the latest thread posted to Hacker News using a heuristic. It may fail sometime in the future. The title and url of the article being searched is always printed first... and is worth peeking at.
