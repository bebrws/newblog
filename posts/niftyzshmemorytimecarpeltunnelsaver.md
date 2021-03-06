---
title: 'ZSH shortcut (keybinding) to replace cursor selected word with your preset choice'
author: 'Brad Barrows'
date: '2020-12-29'
hero_image: /static/zshstringreplace.gif
---
# ZSH Is Amazingly Powerful

One of my favorite features is actually it's "line editor" Zle.

Zle is what powers ZSH' input. It provides a quick and easy way to jump through words and syntax, forwards and backwards, providing powerful features all for the sole function of editing one single line (usually - of course it can do more).

So far, I have found that the easiest way to use Zle is with ZSH Widgets.

These Widgets can be bound to keys with bind-key. In this Widgets you are allowed to use the Zle line editor and there you can do cool things like show a message below the prompt. Take input below the prompt. Edit the current prompt. Read the current text being entered into the prompt. Etc etc..

To send keys to the terminal, effectively typing where your cursor currently is you can run:

```
export AVAR="STRING"; Zle -U $AVAR
```

and STRING will appear where your cursor is as if you had typed it. 

It is amazing how powerful a shell can be. You have zsh hooks to run zsh functions on certain events such as changing directories or on signals, you can edit, view and analyze the current prompt all the while having the ability to run processes and manipulate the output.

## Creating a ZSH Widget

I use fzf so that I can quickly script user interfaces that are fast and easy to use. This is going to be another widget where I end up using fzf to take care of what could potentially be a repetitive and annoying task.

Use case and a question:

There are always multiple versions of clang and ar installed on my laptop. The compiler and linker that ships with OSX and that come with XCode are different. 

I don't know why and would love to know actually if anyone can tell me why the ar binary (linker) that is part of a fresh OSX install won't create binaries that can be linked or compiled with another clang build. ( This is not an issue with libtool. ) I get error messages sometimes saying that clang is trying to link a file for architecure A with the same arcitecture A. (It will say something like "unable to link the binary compiled for x86_64 with the other x86_64 binary".)

Anyhow, I hate using xcrun to find the location of the toolchain files and sometimes require CFLAGS or linker arguments and other things I want to quickly look up (and I don't want in an environment variable). So I created the following:

```
function replacecurrentword() {
    export CURRENTWORD="${LBUFFER/* /}${RBUFFER/ */}"

    Zle kill-word
    Zle backward-kill-word

  if [ -z "$CURRENTWORD" ]; then
    export REPLACEMENT="$(cat ~/.my_inserts| fzf  )"
  else 
    export REPLACEMENT="$(cat ~/.my_inserts| fzf  -q $CURRENTWORD)"
  fi

    Zle -M "Replacing $CURRENTWORD with $REPLACEMENT"

    Zle -U "$REPLACEMENT"
}
Zle -N replacecurrentword
bindkey "^rr" replacecurrentword
```

Now this is bound to the following:
Control + r + r

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
./configure CC= clang
```

and with my cursor over clang I can hit Control + r + r

Then select one of the clang strings I have selected to set the compiler for the configuration script.

I may need to jump back and add some quotes around the replaced string in this example, but in most cases I wouldnt't. Only if I had to deal with some OSX specific file path probably and was required to monkey around with sysroot.

This function could do that.. it could do a lot of things most likely


## An Extra Couple Scripts

### Assuming you have a directory named repos in your home directory that you travel to often
With this you can begin typing a directory, then lazily or hastily hit 

Control + r + r

Then fzf will popup with the word you were typing already into the search and you can select one of the repos you want to goto.

The only requirements for ALL of this functionality is  1. fzf binary:
```
brew install fzf
```
and 1. zsh which comes standard with OSX now.

```

function goto_repos_dir_fzf() { 
  export CURRENTWORD="${LBUFFER/* /}${RBUFFER/ */}"

    Zle kill-word
    Zle backward-kill-word

  
    if [ -z "$CURRENTWORD" ]; then
    eval code "$HOME/repos/$(ls ~/repos | fzf)" 
  else 
    eval code "$HOME/repos/$(ls ~/repos | fzf -q $CURRENTWORD)" 
  fi
}
Zle -N goto_repos_dir_fzf
bindkey "^re" goto_repos_dir_fzf
```


### Killing Processes

If there are a few processes you need to get rid of. You could:

```

function kill_process_using_fzf() { 
  export CURRENTWORD="${LBUFFER/* /}${RBUFFER/ */}"

  Zle kill-word
  Zle backward-kill-word

  if [ -z "$CURRENTWORD" ]; then
    sudo kill -9 $(ps -efc | fzf -m  | awk '{print $2}')
  else 
    sudo kill -9 $(ps -efc | fzf -m -q $CURRENTWORD | awk '{print $2}')
  fi
}
Zle -N kill_process_using_fzf
bindkey "^pp" kill_process_using_fzf

```

Control + p + p  now will bring up a nice menu where you can use the tab key to select multiple processes. On enter they will be killed.