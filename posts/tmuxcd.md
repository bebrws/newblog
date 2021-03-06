---
title: 'Using tmux to change directory with a mouse click'
author: 'Brad Barrows'
date: '2020-12-15'
hero_image: /static/tmuxcd.gif
---
# tmux config

First off you are going to need to add the following to your tmux config ~/.tmux.conf:

```
bind -n DoubleClick1Pane { 
   setw -g word-separators ' @"=()[]:'
   run-shell -t 0 "tmha #{mouse_word}"
}

bind -n C-DoubleClick1Pane { 
   setw -g word-separators ' @"=()[]:'
   run-shell -t 0 "tmhac #{mouse_word}"
}

# Make it so when you Option Double Click on a word it is copied to the clip board - easier than selecting it usually
bind -n M-DoubleClick1Pane { 
   setw -g word-separators ' @"=()[]:'
run-shell -t 0 "echo \"#{mouse_word}\" | pbcopy"
}


```

Make sure mouse mode is on:

```
set -g mouse on
```

### NOTE - I am using the latest build of tmux although this should only be necessary for the popup windows

# Create some shell scripts

I put the scripts in /usr/local/bin

/usr/local/bin/tmha

```
#!/usr/bin/env zsh

# tmux display-message "Clicked on: $1"

# alias l='exa -a -a -l' 
# alias lx='exa -a -a -x' 

if [[ "$1" == "package.json" ]]; then
    tmux send-keys -t "$pane" C-z "cat package.json | jq -r '.scripts'" Enter
    tmux send-keys -t "$pane" C-z 'npm run-script $(cat package.json | jq -r ".scripts | keys[]" | fzf)' Enter
elif [[ "$1" == "/Users/"* ]]; then
    tmux send-keys -t "$pane" C-z "lx" Enter
    tmux send-keys -t "$pane" C-z "code $1" Enter
else 
    tmux send-keys -t "$pane" C-z "if [ -d "$1" ]; then cd $1 && lx; else code $1; fi" Enter
fi    
```

/usr/local/bin/tmhac

```
#!/usr/bin/env zsh

# alias l='exa -a -a -l' 
# alias lx='exa -a -a -x' 

tmux send-keys -t "$pane" C-z "code $1" Enter
```

Now whenever you double click on a file it will either try to run npm run-scripts if it is package.json, if it is a specific path then just open VSCode editor to that path, or if it is a direcory then cd to that directory and list all files.

Note that Control clicking will lead to VSCode always being ran on the file clicked.


## If you like this..

Then checkout my [Alacritty Github Fork Releases](https://github.com/bebrws/alacritty-tabs/releases). I have a build of Alacritty that, when Command Click occurs, the word clicked is echoed into the terminal.

