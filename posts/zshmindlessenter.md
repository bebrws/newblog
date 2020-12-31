---
title: 'Ever hit enter mindlessly in your shell? Why not do something useful with that. ZSH Hook Functions'
author: 'Brad Barrows'
date: '2020-12-30'
# hero_image: /static/zshstringreplace.gif
---
# ZSH Is Amazingly Powerful - Some More

I am going to skip the breakdown on this actually and just post some code.

This will make it so on any empty command sent to your shell a zsh function will run and an if block will decide to list out the files in the current directory.

I am finding this to be useful when used along with the key binding I posted for changing to my repository directories.

Now, after I use my "change to a repository directory" keybinding, I am able to hit enter right away, which I had to anyway to get the new prompt line to show up, and I am now given a directory listing.

## The Code

### Setup

This line needs to be somewhere before the meat of this:
```
autoload -U add-zsh-hook
```
## The Functions

Then the actual function/s:

```

# last non empty command entered is $lcmd 
empty_command_preexec(){ ncmd=$1; }
add-zsh-hook -Uz preexec empty_command_preexec
empty_command_precmd(){ 
  if [ "$ncmd" ]; then 
      lcmd=$ncmd; ncmd=; 
    else; 
      exa -a -a -l
    fi; 
  }
add-zsh-hook -Uz precmd empty_command_precmd

```


This code is actually mostly from a [StackOverflow article](https://unix.stackexchange.com/questions/515356/make-zsh-run-a-command-when-no-command-is-entered) but I thought it would go well with the directory changing function and wanted to remember how to do this anyway.

It might be best to just make one document or page with the most helpful shell aliases/functions/tools I have and a list of resources/references.



