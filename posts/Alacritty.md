---
title: 'Alacritty - A Fast OSX Terminal'
author: 'Brad Barrows'
date: '2020-9-17'
hero_image: /static/alacritty.gif
---
## Alacritty
Alacritty is the fastest GPU accelerated terminal emulator for OSX I have used.

The only reason I hadn't tried it or used it very much before was the learning curve 
of a new terminal emulator and it's lack of tabs.

Luckily I was able to figure out how to make a great tmux and alacritty configuration 
file along with some nice bash functions to help with editing the configurations.

## Setting up Alacritty using my build

Download the terminal here: [Alacritty releases](https://github.com/alacritty/alacritty/releases)

I was checking out the code made some changes [here](https://github.com/bebrws/alacritty/releases/download/0.6.0-dev-brads/Alacritty.zip) 
The only difference really was adding an "Always On Top' action. The keyboard combo for this will "Command Shift A".

## Setting up Alacritty using my tmux and alacritty config

Next clone my [configuration files](https://github.com/bebrws/myalacritty)
```
git clone git@github.com:bebrws/myalacritty.git
cd myalacritty
cp tmux.conf ~/.tmux.conf
mkdir -p ~/.config/alacritty/
cp * ~/.config/alacritty/
wget http://bradbarrows.com/dls/jsin.zip
unzip jsin.zip
mv jsin /usr/local/bin/jsin

```

## Bash/ZSH functions
Add these functions to your .zshrc

```

######### ALACRITTY GOOODNESS ############
alias -g alacrittycolors='python3 /Users/bbarrows/Library/Python/3.8//lib/python/site-packages/alacritty_colorscheme/cli.py '
# To use run: alaFontSize 12
function alaFontSize() {
    cat ~/.config/alacritty/alacritty.yml | jsin --yaml --yamlout --whole "(l.font.size=Number(\"$1\")) && l; " > $HOME/.config/alacritty/alacritty.yml.tmp
    mv $HOME/.config/alacritty/alacritty.yml.tmp $HOME/.config/alacritty/alacritty.yml
}
# To use run: alaOpacity 0.8
function alaOpacity() {
    cat ~/.config/alacritty/alacritty.yml | jsin --yaml --yamlout --whole "(l.background_opacity=Number(\"$1\")) && l; " > $HOME/.config/alacritty/alacritty.yml.tmp
    mv $HOME/.config/alacritty/alacritty.yml.tmp $HOME/.config/alacritty/alacritty.yml
}
# To use run: alaColorTheme
# Must run: sudo pip3 install alacrittycolors
# before using
# Also make sure jsin is installed from above or: https://github.com/bebrws/jsin
function alaColorTheme() {
   export ALABASE=$(python3 -m site | grep site | grep packages | head -n 1 | jsin "l.replace(/\s*\'/g, '').replace(/,/g, '')")
   python3 $ALABASE/alacritty_colorscheme/cli.py -a ~/.config/alacritty/colors/$(ls  ~/.config/alacritty/colors/ | fzf --preview "python3 $ALABASE/alacritty_colorscheme/cli.py -a ~/.config/alacritty/colors/{} && htop")
}
function alaResetDark()  {
  cp ~/.config/alacritty/alacritty.yml.dark ~/.config/alacritty/alacritty.yml
}
function alaResetLight()  {
  cp ~/.config/alacritty/alacritty.yml.light  ~/.config/alacritty/alacritty.yml
}

```

## Keyboard shortcuts
* You should end up with tabs that you can click on just like Terminal.app and then can use the keyboard shortcuts "Shift-Left or Right arrow key".
* "Control-b then c" - Create a new tab
* "Control-b then f" - Create a horizonal window in the tab
* "Control-b then v" - Create a veritical window in the tab
* "Alt-Left or Right arrow key" - Move between split windows in the tab
* "Command-Shift-A" - Keep Alacritty always on top
* "Command-Shift-F" - Full screen
* "Command-Shift-=/-" - Font size

All the control and alt backspace and arrow key bindings should work out of the box!

You will end up with this beautiful terminal:

![Alacritty in action](/static/alacritty.gif)