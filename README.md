[![Build Status](https://travis-ci.org/ziel/whoshiring.svg?branch=master)](https://travis-ci.org/ziel/whoshiring)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![js-strict-standard-style](https://img.shields.io/badge/code%20style-strict%20standard-117D6B.svg)](https://github.com/denis-sokolov/strict-standard)

whoshiring
==========

Search the latest Hacker News Who is Hiring thread using the Algolia search api.

status
------

Pre-release -- use at your own risk.

(seems to be working ok though)

installation
-----

For the current git version:

```
git clone https://www.github.com/ziel/whoshiring
cd whoshiring
npm install -g
```

Simpler installation of stable releases will be a thing... once there are stable releases.

usage
-----
```
whoshiring my search terms
```

Here are some example searches:

```
whoshiring austin tx
whoshiring elixir
whoshiring java london
```

notes
-----

`whoshiring` tries to find the latest thread posted to Hacker News using a heuristic. It may fail sometime in the future. The title and url of the article being searched is always printed first, and is worth peeking at.
