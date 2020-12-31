---
title: 'Ever hit enter mindlessly in your shell? Why not do something useful with that. ZSH Hook Functions'
author: 'Brad Barrows'
date: '2020-12-30'
# hero_image: /static/zshstringreplace.gif
---
# ZSH Is Amazingly Powerful - Some More

I am going to skip the breakdown on this actually and just post some code.

This will make it so on any empty command snet to your shell a zsh function will run and an if block will decide to list out the files in the current directory.

I find this very useful in conjunction with the key binding I just posted to jump to directories in my repos directory.

Then I use my keybinding. Hit enter to get the new prompt line to show and now I have a directory listing as well! But only when I want, when I am not trying to do something important!

## Code

### First Off

This line needs to be somewhere before the meat of this:
```
autoload -U add-zsh-hook
```


Then the actual function/s:

```

local ncmd;
local lcmd;
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


