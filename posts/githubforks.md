---
title: 'Find recently updated Github forks and clones with the command line tool gfnfs'
author: 'Brad Barrows'
date: '2020-9-04'
# hero_image: /static/githubfindforks.png
---
# Up to date Github Forks and Repositories with gfnfs

I was getting tired of clicking through all the forks for a repo then looking for the commits to find which ones were up to date so I wrote a command line utitlity to do it for me.

The repository is at: [githubFindNewestForks](https://github.com/bebrws/githubFindNewestForks)

Here is an image showing the tail end of the output:

![An image of the output of gfnfs](/static/githubfindforks.png)

To use run:

```
npm install -g github-find-newest-forks
gfnfs
```