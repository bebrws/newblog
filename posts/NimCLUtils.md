---
title: 'Writing Nim Command Line Utilities'
author: 'Brad Barrows'
date: '2020-1-20'
# hero_image: /static/niceday.png
---

Nim is an incredible language. It has an amazing type and macro system but I am not knowledgable enough to really go into how great this all is.

One great use for Nim that I have found though is writing command line utilities.

When scripting something maybe too slow to write or run then writing it in Nim might be a good option.

To get started this is a short little example script which will read lines from stdin until EOF.

For each line read it will check if the line ends with a string which was passed as the first command line option.

If it does that line is echoed out to STDOUT. Basically a simple grep subset example

```
import strformat
import strutils
import os

proc rl(): tuple[line: string, eof: bool]   =
  result.eof = false
  result.line = ""
  var l:string
  try:
    if not stdin.readLine(l):
        result.eof = true
    else:
        result.line = l
  except EOFError:
    result.eof = true

if paramCount() != 1:
    echo fmt"Usage: {paramStr(0)} string-to-check-if-stdin-lines-endswith"
    quit(1)

while true:
  var (l, eof) = rl()
  if eof:
      break
  if l.endsWith paramStr(1):
    echo l
  
```
