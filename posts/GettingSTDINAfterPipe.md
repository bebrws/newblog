---
title: 'Getting Input from STDIN after piping in STDIN to a C or Nim program'
author: 'Brad Barrows'
date: '2020-1-22'
# hero_image: ../static/niceday.png
---

Writing my fzf like Nim library/application I ran into an issue. I could pipe input into the command line utility but then after processing the input from the piped

STDIN I was unable to get input from the user via getch

I actually found the answer was a few lines of code.

In C:

```
#include <stdio.h>
#include <unistd.h>
```
...

```
    if (!isatty(fileno(stdin))) {
        // duplicate stdin file descriptor and open it as a FILE*
        input = fdopen(dup(fileno(stdin)), "r");
        // reopen stdin on the terminal (assuming stdout is still connected to the terminal)
        freopen(ttyname(fileno(stdout)), "r", stdin);
    }

```


In Nim:
```
```
import posix 
import os
import terminal

proc fdopen(f: cint, mode: cstring): File {.
    importc: "fdopen", header: "<stdio.h>", tags: [].}

proc freopen(filename, mode: cstring, stream: File): File {.
    importc: "freopen", nodecl.}    


if getFileInfo(stdin).id.file != 37:
var stdindup = dup(c_fileno(stdin))
var input = fdopen(stdindup, cstring("r"))
discard freopen(ttyname(c_fileno(stdout)), cstring("r"), stdin)

```

Note that c_fdopen and c_freopen should exist in the nim standard library like they do above. I was just having trouble importing them