---
title: 'ZSH shortcut (keybinding) to replace cursor selected word with your preset choice'
author: 'Brad Barrows'
date: '2020-12-30'
hero_image: /static/zshstringreplace.gif
---
# ZSH Is Amazingly Powerful

One of my favorite features is actually it's "line editor" zle.

Zle is what powers ZSH' input. Making it so you can type your command line in and in case you mess up, it provides a quick and easy way to jump through words and syntax, forwards and backwards, providing an impressively powerful featureset all for the sole function of editing one single line (usually - of course it can do more!).

Just to start off with a few tips. With ZSH you can make these things called ZSH Widgets. These Widgets can be bound to keys with bind-key. In this Widgets you are allowed to use the zle line editor and there you can do cool things like show a message below the prompt. Take input below the prompt. Edit the current prompt. Read the current text being entered into the prompt. etc etc..

To send keys to the terminal, effectively typing where your cursor currently is you can run:

```
export AVAR="STRING"; zle -U $AVAR
```

and STRNIG will appear where your cursor is as if you had typed it. 

I hope you can see how powerful this can become.

If you have access to zsh hooks to run zsh functions on certain events such as chaging directories or on signals or if certain events occur. And if you can edit, view and analyze the current prompt along with the normal shell functionality of just running commands then well it seems like you can really come up with some pretty powerful tools.

To take a break from a project I was working on I was wondering if I could create a key binding

```
Control i
```
Is one of the many I set for this one.

That would take the word the cursor is over, and search a file for that word, replacing the word with the line from the file.

I use fzf too so that this can be done interactively in case there is a better option than the best fit line and if you want to choose multiple lines.

One use case is this is selecting a compiler.

Use case and somewhat of a rant:
```
There are multiple versions of clang and ar installed, always on my laptop. The compiler/linker that ships with OSX and that comes with XCode are very different. I don't know why and would love to know actually if anyone can tell me why the default ar linker won't create binaries that can be linked or compiled with clang normally. I get error messages sometimes saying that clang is trying to link a file for one architecure with the same arcitecture..

Anyhow I hate using xcrun to find the location of the files and sometimes have linker arguments and other things I want to quickly look up. So I created the following:
```

ZSH Config:

```
function replacecurrentword() {
    export CURRENTWORD="${LBUFFER/* /}${RBUFFER/ */}"

    zle kill-word
    zle backward-kill-word

    export REPLACEMENT="$(cat ~/.my_inserts| fzf  -q $CURRENTWORD)"

    zle -M "Replacing $CURRENTWORD with $REPLACEMENT"

    zle -U "$REPLACEMENT"
}
zle -N replacecurrentword
bindkey "^rr" replacecurrentword
bindkey "^rw" replacecurrentword
bindkey "^iw" replacecurrentword
```

Now this is bound to the following - I liked it so much I bound it multiple times:
Control r r
Control r w
Control i w

Then I go and create a file at ~/.my_inserts

Currently mine looks like:

```
/usr/local/Cellar/llvm/11.0.0/bin/clang
/usr/local/Cellar/llvm/11.0.0/bin/ar
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ar
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ranlib
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ld
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang  -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk
```

Now I can be typing say:

```
./configure CC=clang
```

and with my cursor over clang I can hit Contorl i w

Then select one of the clang strings I have selected to set the compiler for my configuration. 

I will need to jump back and add some quotes around the replaced string probably and the function could do that but this might be a helpful starting point for for someone else to play around with zle and will make good notes for myself.
