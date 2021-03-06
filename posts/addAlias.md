---
title: 'addAlias - taking notes and improving productivity'
author: 'Brad Barrows'
date: '2020-8-31'
# hero_image: /static/niceday.png
---
## A most useful, simple bash function

A year or two ago I came up with a very simple bash/zsh function which I really like.

It is addAlias.

All it does is take the first argument, a string representing the new alias name, and a second argument being a string repsenting the alias itself.

It then echos this into a file which I source in my .zshrc

The great part about this is that I can be working throughout the day and come across some command line tool or collection of commands that are very useful and not have to write them down or remember them.

I just addAlias them, like:

addAlias gitListUntrackedFiles 'git ls-files --others --exclude-standard'

Then when I forget how to do that git command that lists untracked files I just type git then hit tab a few times. Then this option will appear and I can select it from the list. Saving a ton of time.

To use this add the following to your .zshrc

```
function addAlias() {
  echo "alias $1='$2' "
  echo "alias $1='$2' " >>  $HOME/myaliases.zsh
  echo "" >>  $HOME/myaliases.zsh
  source $HOME/myaliases.zsh
}

source $HOME/myaliases.zsh

```

As you can see it also echos out the alias after you are done so you can make sure no bad string escaping happened.