---
title: 'Map and Reduce in the Shell with Javascript'
author: 'Brad Barrows'
date: '2020-11-22'
---
# Javascript Eval : JEval

I wanted the power of map and reduce in the shell. I want to use Javascript to manage this.

```
#!/usr/bin/env node

const readline = require('readline');
const evalString = process.argv[process.argv.length - 1];

function evalInContext() {
    eval(evalString);
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (line) {
  line.length && evalInContext.call(line);
});

```