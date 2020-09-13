---
title: 'Chrome Extension to Fuzzy Search Bookmarks and History'
author: 'Brad Barrows'
date: '2020-9-07'
# hero_image: ../static/niceday.png
---
## A Chrome extension to fuzzy search through bookmarks and history

My [chrome extension](https://github.com/bebrws/chrome-omnibox-bookmark-history-search) uses the same fuzzy string search algorithm I came up with for [FZNim](https://github.com/bebrws/fznim) and for this site.

On load of the extension it will create a table of bookmarks to urls and as the user types in the omnibar (following the keyword "dl") will fuzzy string search the omnibar text against bookmarks and grab the first few, highest ranking results. It then appens on a few results from the Chrome history when searched for the same term.

I didn't see any lightweight Chrome Extensions that provided this functionaliy. This extension weighs in at under 150 lines of code.

### Fuzzy String Search algorithm

The fuxxy string search algorithm weighs characters in a row and showing up early on in the string very heavily.

### Usage:

![An animated gif of the usage of the chrome extension](/static/chrome-bookmark-history-search-ex-usage.gif)

### Install

The extension can be downloaded [from the Google Web Store](https://chrome.google.com/webstore/detail/bookmark-history-fuzzy-se/ahckmbemdipobmogmbpmbailnhfpjnbm?hl=en&authuser=0)